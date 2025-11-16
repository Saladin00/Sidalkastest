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
    // ============================
    // GET /api/lks
    // ============================
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Lks::with(['verifikasiTerbaru', 'kecamatan']);

        if ($user->hasRole('operator') || $user->hasRole('petugas')) {
            if ($user->kecamatan_id) {
                $query->where('kecamatan_id', $user->kecamatan_id);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'User belum memiliki kecamatan_id.'
                ], 403);
            }
        }

        if ($user->hasRole('lks')) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kecamatan_id')) {
            $query->where('kecamatan_id', $request->kecamatan_id);
        }

        if ($request->filled('jenis')) {
            $query->where('jenis_layanan', $request->jenis);
        }

        if ($request->filled('search')) {
            $query->where('nama', 'LIKE', '%' . $request->search . '%');
        }

        $data = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $data
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




}
