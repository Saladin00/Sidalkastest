<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\User;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class OperatorVerifikasiController extends Controller
{
    // 🔹 Operator lihat data di kecamatan-nya
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

    // 🔹 Operator mengirim data verifikasi ke petugas kecamatan
public function kirimKePetugas(Request $request, $id)
{
    $user = $request->user();

    // Ambil data verifikasi
    $verifikasi = Verifikasi::with('lks')->findOrFail($id);

    // Pastikan operator hanya kirim data di kecamatannya
    if ($verifikasi->lks->kecamatan_id !== $user->kecamatan_id) {
        return response()->json([
            'success' => false,
            'message' => 'Anda tidak memiliki izin untuk mengirim data di luar kecamatan Anda.',
        ], 403);
    }

    // Cari petugas di kecamatan yang sama
    $petugas = \App\Models\User::role('petugas')
        ->where('kecamatan_id', $user->kecamatan_id)
        ->first();

    if (!$petugas) {
        return response()->json([
            'success' => false,
            'message' => 'Tidak ada petugas yang terdaftar di kecamatan ini.',
        ], 404);
    }

    // Update data verifikasi → assign ke petugas & ubah status
    $verifikasi->update([
        'petugas_id' => $petugas->id,
        'status' => 'proses_survei',
        'tanggal_verifikasi' => now(),
    ]);

    // Tambahkan log aktivitas
    \App\Models\VerifikasiLog::create([
        'verifikasi_id' => $verifikasi->id,
        'user_id' => $user->id,
        'aksi' => 'kirim_petugas',
        'keterangan' => 'Operator mengirim data verifikasi ke petugas survei.',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Data berhasil dikirim ke petugas survei.',
        'data' => $verifikasi->load(['lks', 'petugas']),
    ]);
}


}
