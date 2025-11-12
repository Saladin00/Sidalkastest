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
        $query = Lks::with(['verifikasiTerbaru', 'kecamatan']); // relasi kecamatan ditambahkan

        // filter berdasarkan parameter query
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->kecamatan_id) {
            $query->where('kecamatan_id', $request->kecamatan_id);
        }

        if ($request->jenis) {
            $query->where('jenis_layanan', $request->jenis);
        }

        return response()->json([
            'data' => $query->latest()->get()
        ]);
    }

    // ➕ POST /api/lks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_layanan' => 'required|string|max:255',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'status' => 'nullable|in:Aktif,Nonaktif,Pending',

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

        // 🟢 Buat LKS baru
        $lks = Lks::create(array_merge($validated, [
            'status' => $validated['status'] ?? 'Pending',
        ]));

        // 📎 Upload dokumen (jika ada)
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
        $petugasId = Auth::check() ? Auth::id() : User::first()->id;

        $verif = Verifikasi::create([
            'lks_id' => $lks->id,
            'petugas_id' => $petugasId,
            'status' => 'menunggu',
            'penilaian' => 'Menunggu proses verifikasi.',
            'catatan' => 'Verifikasi otomatis dibuat saat LKS baru dibuat.',
            'tanggal_verifikasi' => now(),
        ]);

        \Log::info('Verifikasi otomatis dibuat', ['verifikasi_id' => $verif->id]);

        return response()->json([
            'message' => 'LKS berhasil dibuat dan verifikasi awal ditambahkan.',
            'data' => $lks->load(['verifikasiTerbaru', 'kecamatan'])
        ], 201);
    }

    // 👁️ GET /api/lks/{id}
    public function show($id)
    {
        $lks = Lks::with(['verifikasiTerbaru.petugas', 'kecamatan'])->findOrFail($id);
        return response()->json($lks);
    }

    // ✏️ PUT /api/lks/{id}
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_layanan' => 'required|string|max:255',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'status' => 'required|in:Aktif,Nonaktif,Pending',
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

        // Tambah dokumen baru jika ada
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
            'message' => '✅ Data LKS berhasil diperbarui',
            'data' => $lks->load('kecamatan')
        ]);
    }

    // 🗑️ DELETE /api/lks/{id}
    public function destroy($id)
    {
        $lks = Lks::findOrFail($id);

        if ($lks->dokumen) {
            $docs = json_decode($lks->dokumen, true);
            foreach ($docs as $doc) {
                $relative = str_replace(asset('storage/'), '', $doc['url']);
                Storage::disk('public')->delete($relative);
            }
        }

        $lks->delete();

        return response()->json(['message' => '🗑️ LKS dihapus']);
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

        return $pdf->stream('Profil_LKS_' . preg_replace('/\s+/', '_', $lks->nama) . '.pdf');


    }

    public function getByKecamatan($id)
{
    $data = Lks::where('kecamatan_id', $id)->get(['id', 'nama']);
    return response()->json(['data' => $data]);


}
// 🏙️ Ambil daftar LKS berdasarkan kecamatan
public function byKecamatan($id)
{
    try {
        $data = \App\Models\Lks::where('kecamatan_id', $id)
            ->select('id', 'nama')
            ->orderBy('nama')
            ->get();

        return response()->json([
            'message' => 'Daftar LKS berhasil diambil',
            'data' => $data
        ], 200);
    } catch (\Exception $e) {
        \Log::error('Gagal ambil LKS by kecamatan', ['error' => $e->getMessage()]);
        return response()->json([
            'message' => 'Terjadi kesalahan saat mengambil data LKS'
        ], 500);
    }
}


}
