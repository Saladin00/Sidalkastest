<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Lks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Verifikasi;
use App\Models\User;

class LKSController extends Controller
{
    public function index(Request $request)
{
    try {
        $user = $request->user();
        $query = Lks::with(['verifikasiTerbaru', 'kecamatan'])
    ->whereHas('verifikasiTerbaru', function($q) {
        $q->where('status', 'valid');
    });


        // 🔹 Jika operator / petugas → hanya tampilkan LKS di kecamatan-nya
        if ($user->hasAnyRole(['operator', 'petugas'])) {
            if (!$user->kecamatan_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'User belum memiliki kecamatan_id.'
                ], 400);
            }
            $query->where('kecamatan_id', $user->kecamatan_id);
        }

        // 🔹 Jika LKS → hanya data miliknya
        if ($user->hasRole('lks')) {
            $query->where('user_id', $user->id);
        }

        // 🔹 Filter opsional
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%$search%")
                  ->orWhere('jenis_layanan', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kecamatan_id')) {
            $query->where('kecamatan_id', $request->kecamatan_id);
        }

        // 🔹 Ambil data (tanpa paginate dulu)
        $data = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan: ' . $e->getMessage()
        ], 500);
    }
}
// ============================
    // GET /api/lks
    // ============================
    
    
    
    public function toggleStatus(Request $request, $id)
{
    $auth = $request->user();
    $target = User::with(['roles', 'lks'])->findOrFail($id);

    if (!$auth->hasAnyRole(['admin', 'operator'])) {
        return response()->json(['message' => 'Akses ditolak'], 403);
    }

    if ($auth->hasRole('operator')) {
        if (
            !$target->hasRole('lks') ||
            $target->kecamatan_id !== $auth->kecamatan_id
        ) {
            return response()->json([
                'message' => 'Anda hanya boleh mengubah status akun LKS di kecamatan Anda sendiri.'
            ], 403);
        }
    }

    $target->status_aktif = !$target->status_aktif;
    $target->save();

    // 🔄 Sinkronkan juga status di tabel LKS
    if ($target->hasRole('lks') && $target->lks) {
        $target->lks->status = $target->status_aktif ? 'disetujui' : 'pending';
        $target->lks->save();
    }

    return response()->json([
        'message' => 'Status akun berhasil diperbarui',
        'status_aktif' => $target->status_aktif,
        'lks_status' => $target->lks?->status,
    ]);
}


    // ============================
    // POST /api/lks
    // ============================
    public function store(Request $request)
{
    $validated = $request->validate([
        'nama' => 'required|string|max:255',
        'jenis_layanan' => 'required|string|max:255',
        'kecamatan_id' => 'required|exists:kecamatan,id',

        'alamat' => 'nullable|string',
        'kelurahan' => 'nullable|string',
        'npwp' => 'nullable|string',
        'kontak_pengurus' => 'nullable|string',

        'akta_pendirian' => 'nullable|string',
        'izin_operasional' => 'nullable|string',
        'legalitas' => 'nullable|string',
        'no_akta' => 'nullable|string',

        'status_akreditasi' => 'nullable|string',
        'no_sertifikat' => 'nullable|string',
        'tanggal_akreditasi' => 'nullable|date',

        'koordinat' => 'nullable|string',
        'jumlah_pengurus' => 'nullable|integer',
        'sarana' => 'nullable|string',
        'hasil_observasi' => 'nullable|string',
        'tindak_lanjut' => 'nullable|string',

        'status' => 'nullable|in:aktif,nonaktif,pending',
        'dokumen.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png'
    ]);

    // Buat LKS
    $lks = Lks::create(array_merge($validated, [
        'user_id' => Auth::id(),
        'status' => $validated['status'] ?? 'pending'
    ]));

    // Upload dokumen
    if ($request->hasFile('dokumen')) {
        $paths = [];
        foreach ($request->file('dokumen') as $file) {
            $path = $file->store('dokumen_lks', 'public');

            $paths[] = [
                'name' => $file->getClientOriginalName(),
                'url'  => asset('storage/' . $path),
            ];
        }
        $lks->dokumen = json_encode($paths);
        $lks->save();
    }

    // Buat verifikasi default
    $petugasId = User::role('petugas')->first()?->id ?? Auth::id();

    Verifikasi::create([
        'lks_id' => $lks->id,
        'petugas_id' => $petugasId,
        'status' => 'menunggu',
        'penilaian' => 'Menunggu proses verifikasi.',
        'catatan' => 'Verifikasi otomatis dibuat saat LKS baru dibuat.',
        'tanggal_verifikasi' => now(),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'LKS berhasil dibuat.',
        'data' => $lks->load(['kecamatan', 'verifikasiTerbaru'])
    ]);
}


    // ============================
    // GET /api/lks/{id}
    // ============================
    public function show($id)
    {
        $lks = Lks::with([
            'user:id,name,email',
            'kecamatan:id,nama',
            'verifikasiTerbaru.petugas:id,name',
            'klien:id,lks_id,nama',
            'kunjungan:id,lks_id,tanggal,catatan',
        ])->find($id);

        if (!$lks) {
            return response()->json([
                'success' => false,
                'message' => 'Data LKS tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $lks
        ]);
    }

    // ============================
    // PUT /api/lks/{id}
    // ============================
    public function update(Request $request, $id)
{
    $validated = $request->validate([
        'nama' => 'required|string|max:255',
        'jenis_layanan' => 'required|string|max:255',
        'kecamatan_id' => 'required|exists:kecamatan,id',
        'status' => 'required|in:aktif,nonaktif,pending',

        'alamat' => 'nullable|string',
        'kelurahan' => 'nullable|string',
        'npwp' => 'nullable|string',
        'kontak_pengurus' => 'nullable|string',

        'akta_pendirian' => 'nullable|string',
        'izin_operasional' => 'nullable|string',
        'legalitas' => 'nullable|string',
        'no_akta' => 'nullable|string',

        'status_akreditasi' => 'nullable|string',
        'no_sertifikat' => 'nullable|string',
        'tanggal_akreditasi' => 'nullable|date',

        'koordinat' => 'nullable|string',
        'jumlah_pengurus' => 'nullable|integer',
        'sarana' => 'nullable|string',
        'hasil_observasi' => 'nullable|string',
        'tindak_lanjut' => 'nullable|string',

        'dokumen.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png'
    ]);

    $lks = Lks::findOrFail($id);
    $lks->update($validated);

    // Upload file tambahan
    if ($request->hasFile('dokumen')) {
        $existing = $lks->dokumen ? json_decode($lks->dokumen, true) : [];
        $baru = [];

        foreach ($request->file('dokumen') as $file) {
            $path = $file->store('dokumen_lks', 'public');

            $baru[] = [
                'name' => $file->getClientOriginalName(),
                'url' => asset('storage/' . $path),
            ];
        }

        $lks->dokumen = json_encode(array_merge($existing, $baru));
        $lks->save();
    }

    return response()->json([
        'success' => true,
        'message' => 'Data LKS berhasil diperbarui',
        'data' => $lks->load('kecamatan')
    ]);
}

    // ============================
    // DELETE /api/lks/{id}
    // ============================
    public function destroy($id)
    {
        $lks = Lks::findOrFail($id);

        if ($lks->dokumen) {
            foreach (json_decode($lks->dokumen, true) as $doc) {
                $filePath = str_replace(asset('storage/'), '', $doc['url']);
                Storage::disk('public')->delete($filePath);
            }
        }

        $lks->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data LKS berhasil dihapus'
        ]);
    }

    // ============================
    // GET /api/lks/me
    // ============================
    // =============================
// LKS: GET PROFILE OF LOGGED USER
// =============================
// ===============================
// GET /api/lks/me
// ===============================
public function me(Request $request)
{
    $user = $request->user();

    $lks = Lks::with(['kecamatan'])
        ->where('user_id', $user->id)
        ->first();

    if (!$lks) {
        return response()->json([
            'success' => false,
            'message' => 'Data LKS tidak ditemukan untuk user ini.'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $lks
    ], 200);
}


// =============================
// LKS: UPDATE PROFILE
// =============================
// ===============================
// PUT /api/lks/me/update
// ===============================
public function updateMe(Request $request)
{
    $user = $request->user();

    $lks = Lks::where('user_id', $user->id)->firstOrFail();

    $validated = $request->validate([
        'nama' => 'nullable|string|max:255',
        'jenis_layanan' => 'nullable|string|max:255',
        'kecamatan_id' => 'nullable|exists:kecamatan,id',

        'alamat' => 'nullable|string',
        'kelurahan' => 'nullable|string',
        'npwp' => 'nullable|string',
        'kontak_pengurus' => 'nullable|string',

        'akta_pendirian' => 'nullable|string',
        'izin_operasional' => 'nullable|string',
        'legalitas' => 'nullable|string',
        'no_akta' => 'nullable|string',

        'status_akreditasi' => 'nullable|string',
        'no_sertifikat' => 'nullable|string',
        'tanggal_akreditasi' => 'nullable|date',

        'koordinat' => 'nullable|string',
        'jumlah_pengurus' => 'nullable|integer',
        'sarana' => 'nullable|string',
        'hasil_observasi' => 'nullable|string',
        'tindak_lanjut' => 'nullable|string',

        'dokumen.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png'
    ]);

    $lks->update($validated);

    // Upload dokumen baru
    if ($request->hasFile('dokumen')) {
        $existing = $lks->dokumen ? json_decode($lks->dokumen, true) : [];
        $baru = [];

        foreach ($request->file('dokumen') as $file) {
            $path = $file->store('dokumen_lks', 'public');
            $baru[] = [
                'name' => $file->getClientOriginalName(),
                'url'  => asset('storage/' . $path),
            ];
        }

        $lks->dokumen = json_encode(array_merge($existing, $baru));
        $lks->save();
    }

    return response()->json([
        'success' => true,
        'message' => 'Profil LKS berhasil diperbarui.',
        'data' => $lks
    ]);
}

public function profileView(Request $request)
{
    $user = $request->user();

    // === ROLE LKS: ambil LKS miliknya ===
    if ($user->hasRole('lks')) {

        // AUTO FIX: kalau user.lks_id ada tapi user_id di tabel lks kosong → perbaiki
        if ($user->lks_id) {
            $lks = Lks::find($user->lks_id);

            if ($lks && !$lks->user_id) {
                $lks->user_id = $user->id;
                $lks->save();
            }
        }

        // Ambil ulang setelah fix
        $lks = Lks::where('user_id', $user->id)->first();

        // Jika tetap tidak ada, buat baru (ANTI ERROR)
        if (!$lks) {
            $lks = Lks::create([
                'user_id' => $user->id,
                'nama' => $user->name,
                'jenis_layanan' => '',
                'kecamatan_id' => $user->kecamatan_id,
                'status' => 'pending',
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $lks
        ]);
    }

    // === ROLE ADMIN ===
    if ($user->hasRole('admin')) {
        $lksId = $request->query('id');
        $lks = $lksId ? Lks::find($lksId) : Lks::first();
        return response()->json(['success' => true, 'data' => $lks]);
    }

    // === ROLE OPERATOR / PETUGAS ===
    if ($user->hasRole('operator') || $user->hasRole('petugas')) {
        $lks = Lks::where('kecamatan_id', $user->kecamatan_id)->first();
        return response()->json(['success' => true, 'data' => $lks]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Role tidak memiliki akses'
    ], 403);
}

// ===============================================
// FORMAT UNTUK FE (mapping kolom DB → FE)
// ===============================================
private function formatLksForFE($lks)
{
    if (!$lks) {
        return response()->json(['success' => true, 'data' => []]);
    }

    $data = $lks->toArray();

    // Mapping agar FE tetap bekerja
    $data['jumlah_pengurus']   = $data['pengurus'];      // DB → FE
    $data['status_akreditasi'] = $data['akreditasi'];    // DB → FE

    return response()->json([
        'success' => true,
        'data' => $data
    ]);
}


// ===============================================
// ROLE LKS (ambil data miliknya + mapping FE)
// ===============================================
private function meForFE(Request $request)
{
    $user = $request->user();

    $lks = Lks::where('user_id', $user->id)->first();

    if (!$lks) {
        return response()->json(['success' => false, 'data' => []], 404);
    }

    return $this->formatLksForFE($lks);
}
public function getByKecamatan($id)
{
    $lks = Lks::where('kecamatan_id', $id)->get();

    return response()->json([
        'success' => true,
        'data' => $lks
    ]);
}




}
