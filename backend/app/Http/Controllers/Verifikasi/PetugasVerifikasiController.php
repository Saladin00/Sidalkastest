<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class PetugasVerifikasiController extends Controller
{
    // 🔹 Petugas lihat tugas survei-nya
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['lks', 'lks.kecamatan'])
            ->where('petugas_id', $user->id)
            ->whereHas('lks', fn($q) =>
                $q->where('kecamatan_id', $user->kecamatan_id)
            )
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    // 🔹 Isi hasil survei & kirim ke admin
    public function kirimKeAdmin(Request $request, $id)
    {
        $validated = $request->validate([
            'penilaian'   => 'required|string',
            'catatan'     => 'nullable|string',
            'foto_bukti'  => 'nullable', // JSON string dari frontend
        ]);

        // Decode foto_bukti JSON string → array
        $foto = [];
        if ($request->foto_bukti) {
            try {
                $foto = json_decode($request->foto_bukti, true);
                if (!is_array($foto)) {
                    $foto = [];
                }
            } catch (\Throwable $th) {
                $foto = [];
            }
        }

        $verifikasi = Verifikasi::with('lks')->findOrFail($id);

        // Update verifikasi
        $verifikasi->update([
            'status'            => 'dikirim_admin',      // pastikan ENUM status ada
            'penilaian'         => $validated['penilaian'],
            'catatan'           => $validated['catatan'] ?? 'Petugas mengirim hasil survei.',
            'foto_bukti'        => $foto,
            'tanggal_verifikasi'=> now(),                // ⬅️ inilah tanggal verifikasi lapangan
        ]);

        // Update LKS → sedang diproses admin
        $verifikasi->lks->update([
            'status_verifikasi' => 'proses_validasi',
        ]);

        // Log
        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id'       => $request->user()->id,
            'aksi'          => 'kirim_admin',
            'keterangan'    => 'Petugas mengirim hasil survei ke Admin Dinsos.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Hasil survei berhasil dikirim ke admin.',
        ]);
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
