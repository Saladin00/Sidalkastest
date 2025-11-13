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
    // 🔍 GET /api/lks
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Lks::with(['verifikasiTerbaru', 'kecamatan']);

        // 🟢 Operator & Petugas hanya bisa lihat LKS di wilayahnya
        if ($user->hasRole('operator') || $user->hasRole('petugas')) {
            if ($user->kecamatan_id) {
                $query->where('kecamatan_id', $user->kecamatan_id);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'User belum memiliki kecamatan_id yang terdaftar.'
                ], 403);
            }
        }

        // 🟢 LKS hanya bisa lihat datanya sendiri
        if ($user->hasRole('lks')) {
            $query->where('user_id', $user->id);
        }

        // 🔍 Filter tambahan
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
            'message' => 'Data LKS berhasil diambil',
            'data' => $data
        ], 200);
    }

    // ➕ POST /api/lks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_layanan' => 'required|string|max:255',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'status' => 'nullable|in:aktif,nonaktif,pending',
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
        ]);

        $lks = Lks::create(array_merge($validated, [
            'status' => $validated['status'] ?? 'pending',
            'user_id' => Auth::id()
        ]));

        // 📎 Upload dokumen (opsional)
        if ($request->hasFile('dokumen')) {
            $dokumenPaths = [];
            foreach ($request->file('dokumen') as $file) {
                $path = $file->store('dokumen_lks', 'public');
                $dokumenPaths[] = [
                    'name' => $file->getClientOriginalName(),
                    'url'  => asset('storage/' . $path),
                ];
            }
            $lks->dokumen = json_encode($dokumenPaths);
            $lks->save();
        }

        // 🧩 Buat verifikasi awal otomatis
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
            'message' => 'LKS berhasil dibuat dan verifikasi awal ditambahkan.',
            'data' => $lks->load(['verifikasiTerbaru', 'kecamatan'])
        ], 201);
    }

    // 👁️ GET /api/lks/{id}
   // 👁️ GET /api/lks/{id}
public function show($id)
{
    try {
       $lks = Lks::with([
    'user:id,name,email',
    'kecamatan:id,nama',
    'verifikasiTerbaru.petugas:id,name',
    'klien:id,lks_id,nama', // ✅ hapus jenis_kelamin & tanggal_lahir
    'kunjungan:id,lks_id,tanggal,catatan',
])->findOrFail($id);


        return response()->json([
            'success' => true,
            'data' => $lks
        ]);
    } catch (\Throwable $e) {
        \Log::error('Gagal ambil detail LKS', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan server',
        ], 500);
    }
}



    // ✏️ PUT /api/lks/{id}
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
        ]);

        $lks = Lks::findOrFail($id);
        $lks->update($validated);

        // 📎 Update dokumen jika ada
        if ($request->hasFile('dokumen')) {
            $existingDocs = $lks->dokumen ? json_decode($lks->dokumen, true) : [];
            foreach ($request->file('dokumen') as $file) {
                $path = $file->store('dokumen_lks', 'public');
                $existingDocs[] = [
                    'name' => $file->getClientOriginalName(),
                    'url'  => asset('storage/' . $path),
                ];
            }
            $lks->dokumen = json_encode($existingDocs);
            $lks->save();
        }

        return response()->json([
            'success' => true,
            'message' => '✅ Data LKS berhasil diperbarui',
            'data' => $lks->load('kecamatan')
        ]);
    }

    // 🗑️ DELETE /api/lks/{id}
    public function destroy($id)
    {
        $lks = Lks::findOrFail($id);

        if ($lks->dokumen) {
            foreach (json_decode($lks->dokumen, true) as $doc) {
                $relative = str_replace(asset('storage/'), '', $doc['url']);
                Storage::disk('public')->delete($relative);
            }
        }

        $lks->delete();

        return response()->json([
            'success' => true,
            'message' => '🗑️ Data LKS berhasil dihapus'
        ]);
    }

    // 📎 POST /api/lks/{id}/upload-dokumen
    public function uploadDokumen(Request $request, $id)
    {
        $lks = Lks::findOrFail($id);
        if ($request->hasFile('dokumen')) {
            $dokumenBaru = [];
            foreach ($request->file('dokumen') as $file) {
                $path = $file->store('dokumen_lks', 'public');
                $dokumenBaru[] = [
                    'name' => $file->getClientOriginalName(),
                    'url'  => asset('storage/' . $path),
                ];
            }
            $existing = $lks->dokumen ? json_decode($lks->dokumen, true) : [];
            $lks->dokumen = json_encode(array_merge($existing, $dokumenBaru));
            $lks->save();
        }

        return response()->json([
            'success' => true,
            'message' => '📎 Dokumen berhasil diunggah',
            'dokumen' => json_decode($lks->dokumen, true),
        ]);
    }

    // 🖨️ CETAK PROFIL PDF
    public function cetakProfil($id)
    {
        $lks = Lks::with(['verifikasiTerbaru.petugas', 'kecamatan'])->find($id);
        if (!$lks) {
            abort(404, 'Data LKS tidak ditemukan.');
        }

        $pdf = Pdf::loadView('lks_pdf', compact('lks'))
            ->setPaper('A4', 'portrait');

        return $pdf->stream('Profil_LKS_' . preg_replace('/\s+/', '_', $lks->nama) . '.pdf');    }

    // 🏙️ GET /api/lks/by-kecamatan/{id}
   public function getByKecamatan($id)
{
    try {
        $lks = Lks::select('id', 'nama', 'kecamatan_id')
            ->where('kecamatan_id', $id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $lks,
        ], 200);

    } catch (\Exception $e) {

        \Log::error("getByKecamatan Error: " . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil LKS berdasarkan kecamatan',
            'error' => $e->getMessage(),
        ], 500);
    }
}



}
