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

    // =======================================
    // GET /api/lks
    // =======================================
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            $query = Lks::with(['verifikasiTerbaru', 'kecamatan'])
                ->whereHas('verifikasiTerbaru', function ($q) {
                    $q->where('status', 'valid');
                });

            if ($user->hasAnyRole(['operator', 'petugas'])) {
                $query->where('kecamatan_id', $user->kecamatan_id);
            }

            if ($user->hasRole('lks')) {
                $query->where('user_id', $user->id);
            }

            if ($request->filled('search')) {
                $query->where('nama', 'like', "%" . $request->search . "%");
            }

            if ($request->filled('kecamatan_id')) {
                $query->where('kecamatan_id', $request->kecamatan_id);
            }

            return response()->json([
                'success' => true,
                'data' => $query->orderBy('created_at', 'desc')->get()
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    // =======================================
    // TOGGLE STATUS
    // =======================================
    public function toggleStatus(Request $request, $id)
    {
        $auth = $request->user();
        $target = User::with(['roles', 'lks'])->findOrFail($id);

        if (!$auth->hasAnyRole(['admin', 'operator'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        if ($auth->hasRole('operator')) {
            if (!$target->hasRole('lks') || $target->kecamatan_id !== $auth->kecamatan_id) {
                return response()->json([
                    'message' => 'Anda hanya boleh mengubah status akun LKS di kecamatan Anda.'
                ], 403);
            }
        }

        $target->status_aktif = !$target->status_aktif;
        $target->save();

        if ($target->hasRole('lks') && $target->lks) {
            $target->lks->status = $target->status_aktif ? 'disetujui' : 'pending';
            $target->lks->save();
        }

        return response()->json([
            'message' => 'Status akun diperbarui',
            'status_aktif' => $target->status_aktif
        ]);
    }


    // =======================================
    // POST /api/lks — STORE
    // =======================================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_layanan' => 'required|string|max:255',
            'kecamatan_id' => 'required|exists:kecamatan,id',

            'jenis_bantuan' => 'nullable|string',
            'kelompok_umur' => 'nullable|string',

            'alamat' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'npwp' => 'nullable|string',
            'kontak_pengurus' => 'nullable|string',

            'akta_pendirian' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
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

        $lks = Lks::create(array_merge($validated, [
            'user_id' => Auth::id(),
            'status' => $validated['status'] ?? 'pending'
        ]));

        // Upload Akta Pendirian
        if ($request->hasFile('akta_pendirian')) {
            $path = $request->file('akta_pendirian')->store('akta_pendirian', 'public');
            $lks->akta_pendirian = $path;
            $lks->save();
        }

        // Upload dokumen tambahan
        if ($request->hasFile('dokumen')) {
            $paths = [];

            foreach ($request->file('dokumen') as $file) {
                $path = $file->store('dokumen_lks', 'public');
                $paths[] = [
                    'name' => $file->getClientOriginalName(),
                    'url' => asset("storage/" . $path)
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
            'penilaian' => 'Menunggu verifikasi.',
            'catatan' => 'Otomatis dibuat.',
            'tanggal_verifikasi' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'LKS berhasil dibuat.',
            'data' => $lks
        ]);
    }


    // =======================================
    // GET /api/lks/{id}
    // =======================================
    public function show($id)
    {
        $lks = Lks::with([
            'user:id,name,email',
            'kecamatan:id,nama',
            'verifikasiTerbaru.petugas:id,name',
            'klien',
            'kunjungan'
        ])->find($id);

        if (!$lks) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $lks]);
    }


    // =======================================
    // PUT /api/lks/{id} — UPDATE
    // =======================================
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_layanan' => 'required|string|max:255',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'status' => 'required|in:aktif,nonaktif,pending',

            'jenis_bantuan' => 'nullable|string',
            'kelompok_umur' => 'nullable|string',

            'alamat' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'npwp' => 'nullable|string',
            'kontak_pengurus' => 'nullable|string',

            'akta_pendirian' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
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

            'dokumen.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
        ]);

        $lks = Lks::findOrFail($id);
        $lks->update($validated);

        // Update Akta Pendirian
        if ($request->hasFile('akta_pendirian')) {
            if ($lks->akta_pendirian && Storage::disk('public')->exists($lks->akta_pendirian)) {
                Storage::disk('public')->delete($lks->akta_pendirian);
            }
            $path = $request->file('akta_pendirian')->store('akta_pendirian', 'public');
            $lks->akta_pendirian = $path;
            $lks->save();
        }

        // Upload dokumen tambahan
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
            'message' => 'LKS berhasil diupdate.',
            'data' => $lks
        ]);
    }


    // =======================================
    // DELETE /api/lks/{id}
    // =======================================
    public function destroy($id)
    {
        $lks = Lks::findOrFail($id);

        if ($lks->dokumen) {
            foreach (json_decode($lks->dokumen, true) as $doc) {
                $filePath = str_replace(asset('storage/'), '', $doc['url']);
                Storage::disk('public')->delete($filePath);
            }
        }

        if ($lks->akta_pendirian) {
            Storage::disk('public')->delete($lks->akta_pendirian);
        }

        $lks->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data LKS berhasil dihapus'
        ]);
    }


    // =======================================
    // GET /api/lks/me
    // =======================================
    public function me(Request $request)
    {
        $user = $request->user();
        $lks = Lks::with(['kecamatan'])->where('user_id', $user->id)->first();

        if (!$lks) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $lks]);
    }


    // =======================================
    // PUT /api/lks/me/update
    // =======================================
    public function updateMe(Request $request)
    {
        $user = $request->user();
        $lks = Lks::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'nama' => 'nullable|string|max:255',
            'jenis_layanan' => 'nullable|string|max:255',
            'kecamatan_id' => 'nullable|exists:kecamatan,id',

            'jenis_bantuan' => 'nullable|string',
            'kelompok_umur' => 'nullable|string',

            'alamat' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'npwp' => 'nullable|string',
            'kontak_pengurus' => 'nullable|string',

            'akta_pendirian' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
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

            'dokumen.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
        ]);

        $lks->update($validated);

        if ($request->hasFile('akta_pendirian')) {
            if ($lks->akta_pendirian && Storage::disk('public')->exists($lks->akta_pendirian)) {
                Storage::disk('public')->delete($lks->akta_pendirian);
            }

            $path = $request->file('akta_pendirian')->store('akta_pendirian', 'public');
            $lks->akta_pendirian = $path;
            $lks->save();
        }

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


    // =======================================
    // GET LKS BY KECAMATAN
    // =======================================
    public function getByKecamatan($id)
    {
        return response()->json([
            'success' => true,
            'data' => Lks::where('kecamatan_id', $id)->get()
        ]);
    }
    public function profileView(Request $request)
{
    $user = $request->user();

    if ($user->hasRole('lks')) {

        $lks = Lks::where('user_id', $user->id)->first();

        if (!$lks) {
            return response()->json([
                "success" => false,
                "message" => "Data LKS tidak ditemukan.",
                "data" => null
            ], 200);
        }

        return response()->json([
            "success" => true,
            "data" => [
                "id"                => $lks->id,
                "nama"              => $lks->nama,
                "jenis_layanan"     => $lks->jenis_layanan,
                "alamat"            => $lks->alamat,
                "kelurahan"         => $lks->kelurahan,
                "kecamatan_id"      => $lks->kecamatan_id,
                "status"            => $lks->status,
                "status_verifikasi" => $lks->status_verifikasi ?? "belum_verifikasi",
                "dokumen"           => $lks->dokumen,
                "updated_at"        => $lks->updated_at,
            ]
        ]);
    }

    return response()->json([
        "success" => false,
        "message" => "Role tidak memiliki akses."
    ], 403);
}

}

