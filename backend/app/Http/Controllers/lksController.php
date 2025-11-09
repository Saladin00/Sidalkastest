<?php

namespace App\Http\Controllers;

use App\Models\LKS;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class LKSController extends Controller
{
    // 🔍 GET /api/lks
    public function index(Request $request)
    {
        $query = LKS::query();

        if ($request->status) $query->where('status', $request->status);
        if ($request->kecamatan) $query->where('kecamatan', $request->kecamatan);
        if ($request->jenis) $query->where('jenis_layanan', $request->jenis);

        return response()->json($query->latest()->get());
    }

    // ➕ POST /api/lks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_layanan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'status' => 'required|in:Aktif,Nonaktif',
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

        $lks = LKS::create($validated);

        // 🔹 Upload dokumen (jika ada)
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

        return response()->json([
            'message' => '✅ LKS berhasil ditambahkan',
            'data' => $lks
        ]);
    }

    // 👁️ GET /api/lks/{id}
    public function show($id)
    {
        $lks = LKS::with([
            'verifikasiTerbaru' => function ($q) {
                $q->with('petugas:id,name');
            }
        ])->findOrFail($id);

        return response()->json($lks);
    }

    // ✏️ PUT /api/lks/{id}
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_layanan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'status' => 'required|in:Aktif,Nonaktif',
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

        $lks = LKS::findOrFail($id);
        $lks->update($validated);

        // 🔹 Tambahkan dokumen baru jika ada
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
            'data' => $lks
        ]);
    }

    // 🗑️ DELETE /api/lks/{id}
    public function destroy($id)
    {
        $lks = LKS::findOrFail($id);

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
        $lks = LKS::findOrFail($id);

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
    $lks = LKS::with('verifikasiTerbaru.petugas')->find($id);

    if (!$lks) {
        abort(404, 'Data LKS tidak ditemukan.');
    }

    // Sesuaikan dengan file resources/views/lks_pdf.blade.php
    $pdf = Pdf::loadView('lks_pdf', compact('lks'))
        ->setPaper('A4', 'portrait');

    return $pdf->stream('Profil_LKS_' . preg_replace('/\s+/', '_', $lks->nama) . '.pdf');
}

}
