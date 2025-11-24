<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\User;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class OperatorVerifikasiController extends Controller
{
    // 🔹 Operator lihat data verifikasi di kecamatan-nya
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['lks', 'petugas'])
            ->whereHas('lks', fn($q) => $q->where('kecamatan_id', $user->kecamatan_id))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function show($id)
    {
        $data = Verifikasi::with(['lks', 'petugas', 'logs.user'])->find($id);
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }
        return response()->json(['success' => true, 'data' => $data]);
    }

    // 🔹 LIST PETUGAS di kecamatan operator → untuk dropdown di frontend
    public function listPetugas(Request $request)
    {
        $user = $request->user();

        $petugas = User::role('petugas')
            ->where('kecamatan_id', $user->kecamatan_id)
            ->where('status_aktif', true)
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $petugas,
        ]);
    }

    // 🔹 Operator mengirim verifikasi ke petugas (operator PILIH petugas)
    public function kirimKePetugas(Request $request, $id)
    {
        $user = $request->user();

        $validated = $request->validate([
            'petugas_id' => 'required|exists:users,id',
            'catatan'    => 'nullable|string',
        ]);

        // Ambil verifikasi + LKS
        $verifikasi = Verifikasi::with('lks')->findOrFail($id);

        // Pastikan masih dalam kecamatan operator
        if (!$verifikasi->lks || $verifikasi->lks->kecamatan_id !== $user->kecamatan_id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk mengirim data di luar kecamatan Anda.',
            ], 403);
        }

        // Pastikan petugas masih di kecamatan yang sama
        $petugas = User::role('petugas')
            ->where('id', $validated['petugas_id'])
            ->where('kecamatan_id', $user->kecamatan_id)
            ->first();

        if (!$petugas) {
            return response()->json([
                'success' => false,
                'message' => 'Petugas tidak ditemukan atau bukan di kecamatan ini.',
            ], 404);
        }

        // Update verifikasi → assign petugas & ubah status
        $verifikasi->update([
            'petugas_id' => $petugas->id,
            'status'     => 'proses_survei',  // pastikan ENUM sudah ada
            // ❗ tanggal_verifikasi TIDAK diubah di sini → diisi saat petugas selesai survei
        ]);

        // Update status verifikasi di LKS
        $verifikasi->lks->update([
            'status_verifikasi' => 'proses_survei',
        ]);

        // Log aktivitas
        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id'       => $user->id,
            'aksi'          => 'kirim_petugas',
            'keterangan'    => "Operator mengirim verifikasi ke petugas {$petugas->name}.",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dikirim ke petugas survei.',
            'data'    => $verifikasi->load(['lks', 'petugas']),
        ]);
    }
}
