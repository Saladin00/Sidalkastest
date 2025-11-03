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
            'koordinat' => 'nullable|string|max:255',
        ]);

        $lks = LKS::create($validated);

        return response()->json([
            'message' => 'LKS berhasil ditambahkan',
            'data' => $lks
        ]);
    }

    // 👁️ GET /api/lks/{id}
    public function show($id)
    {
        $lks = LKS::with(['dokumen', 'kunjungan'])->findOrFail($id);
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
            'koordinat' => 'nullable|string|max:255',
        ]);

        $lks = LKS::findOrFail($id);
        $lks->update($validated);

        return response()->json([
            'message' => 'Data LKS berhasil diperbarui',
            'data' => $lks
        ]);
    }

    // 🗑️ DELETE /api/lks/{id}
    public function destroy($id)
    {
        $lks = LKS::findOrFail($id);
        $lks->delete();

        return response()->json(['message' => 'LKS dihapus']);
    }

    // 📎 POST /api/lks/{id}/upload-dokumen
    public function uploadDokumen(Request $request, $id)
    {
        $lks = LKS::findOrFail($id);
        $dokumen = [];

        // Upload Akta
        if ($request->hasFile('akta')) {
            $aktaPath = $request->file('akta')->store('dokumen_lks', 'public');
            $dokumen['akta'] = $aktaPath;
        }

        // Upload Surat Izin
        if ($request->hasFile('izin')) {
            $izinPath = $request->file('izin')->store('dokumen_lks', 'public');
            $dokumen['izin'] = $izinPath;
        }

        // Upload Sertifikat
        if ($request->hasFile('sertifikat')) {
            $sertifikatPath = $request->file('sertifikat')->store('dokumen_lks', 'public');
            $dokumen['sertifikat'] = $sertifikatPath;
        }

        // Simpan ke kolom dokumen (json)
        $lks->dokumen = json_encode($dokumen);
        $lks->save();

        return response()->json([
            'message' => 'Dokumen berhasil diunggah',
            'dokumen' => $dokumen,
        ]);
    }

    // 🖨️ CETAK PROFIL PDF
    public function cetakProfil($id)
    {
        $lks = LKS::findOrFail($id);

        // pastikan data ada
        if (!$lks) {
            abort(404, 'Data LKS tidak ditemukan.');
        }

        // load view PDF
        $pdf = Pdf::loadView('pdf.lks_profil', compact('lks'))
            ->setPaper('A4', 'portrait');

        return $pdf->stream('Profil_LKS_' . $lks->nama . '.pdf');
    }
}
