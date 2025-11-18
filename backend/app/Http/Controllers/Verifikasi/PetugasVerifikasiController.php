<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class PetugasVerifikasiController extends Controller
{
    // 🔹 Petugas lihat verifikasi dari kecamatan-nya
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['lks'])
            ->where('petugas_id', $user->id)
            ->where('status', 'dikirim_petugas')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    // 🔹 Isi hasil survei dan kirim ke admin
    public function kirimKeAdmin(Request $request, $id)
    {
        $validated = $request->validate([
            'hasil_survei' => 'required|array',
            'penilaian' => 'required|string',
            'catatan' => 'nullable|string',
            'foto_bukti' => 'nullable|array',
        ]);

        $verifikasi = Verifikasi::findOrFail($id);
        $verifikasi->update([
            'hasil_survei' => $validated['hasil_survei'],
            'status' => 'dikirim_admin',
            'penilaian' => $validated['penilaian'],
            'catatan' => $validated['catatan'] ?? 'Petugas mengirim hasil survei.',
            'foto_bukti' => $validated['foto_bukti'] ?? [],
            'tanggal_verifikasi' => now(),
        ]);

        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id' => $request->user()->id,
            'aksi' => 'kirim_admin',
            'keterangan' => 'Petugas mengirim hasil survei ke Admin Dinsos.',
        ]);

        return response()->json(['success' => true, 'message' => 'Hasil survei berhasil dikirim ke admin.']);
    }

    public function show($id)
    {
        $data = Verifikasi::with(['lks', 'petugas'])->find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $data]);
    }
}
