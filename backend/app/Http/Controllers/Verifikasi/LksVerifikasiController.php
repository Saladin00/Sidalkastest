<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class LksVerifikasiController extends Controller
{
    // 🔹 Lihat semua verifikasi miliknya
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['petugas', 'logs.user'])
            ->where('lks_id', $user->lks_id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    // 🔹 Ajukan verifikasi ke operator kecamatan
    public function pengajuan(Request $request)
{
    try {
        $user = $request->user();

        $lks = \App\Models\Lks::where('user_id', $user->id)->first();
        if (!$lks) {
            return response()->json([
                'success' => false,
                'message' => 'Data LKS tidak ditemukan untuk akun ini.'
            ], 404);
        }

        // Validasi input
        $request->validate([
            'catatan' => 'nullable|string|max:1000',
            'foto_bukti.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // Upload foto bukti
        $fotoBukti = [];
        if ($request->hasFile('foto_bukti')) {
            foreach ($request->file('foto_bukti') as $file) {
                $path = $file->store('verifikasi_lks', 'public');
                $fotoBukti[] = asset('storage/' . $path);
            }
        }

        // Simpan data verifikasi baru
        $verifikasi = \App\Models\Verifikasi::create([
            'lks_id' => $lks->id,
            'status' => 'menunggu',
            'penilaian' => 'Menunggu review dari operator kecamatan.',
            'catatan' => $request->catatan,
            'foto_bukti' => json_encode($fotoBukti),
            'tanggal_verifikasi' => now(),
        ]);

        // Log aktivitas
        \App\Models\VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id' => $user->id,
            'aksi' => 'pengajuan',
            'keterangan' => 'LKS mengirim pengajuan verifikasi ke operator kecamatan.',
        ]);

        return response()->json([
            'success' => true,
            'message' => '✅ Pengajuan verifikasi berhasil dikirim ke operator kecamatan!',
            'data' => $verifikasi,
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Gagal kirim pengajuan verifikasi: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Server error.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function show($id)
    {
        $data = Verifikasi::with(['petugas', 'logs.user'])->find($id);
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function kirimKePetugas(Request $request, $id)
{
    $user = $request->user();

    try {
        // 1️⃣ Ambil data verifikasi dan relasi LKS-nya
        $verifikasi = Verifikasi::with('lks')->findOrFail($id);

        // 2️⃣ Pastikan operator hanya bisa kirim untuk kecamatannya sendiri
        if (!$verifikasi->lks || $verifikasi->lks->kecamatan_id !== $user->kecamatan_id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk mengirim verifikasi di luar kecamatan Anda.',
            ], 403);
        }

        // 3️⃣ Cek apakah verifikasi sudah pernah dikirim
        if ($verifikasi->status === 'proses_survei' || $verifikasi->status === 'valid') {
            return response()->json([
                'success' => false,
                'message' => 'Data verifikasi ini sudah dikirim atau sudah divalidasi sebelumnya.',
            ], 400);
        }

        // 4️⃣ Cari petugas yang bertugas di kecamatan yang sama
        $petugas = User::role('petugas')
            ->where('kecamatan_id', $user->kecamatan_id)
            ->first();

        if (!$petugas) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada petugas survei yang terdaftar di kecamatan ini.',
            ], 404);
        }

        // 5️⃣ Update data verifikasi → assign petugas & ubah status
        $verifikasi->update([
            'petugas_id' => $petugas->id,
            'status' => 'proses_survei', // pastikan enum di migration support ini
            'tanggal_verifikasi' => now(),
        ]);

        // 6️⃣ Tambahkan log aktivitas
        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id' => $user->id,
            'aksi' => 'kirim_petugas',
            'keterangan' => 'Operator mengirim data verifikasi ke petugas survei.',
        ]);

        return response()->json([
            'success' => true,
            'message' => '✅ Data berhasil dikirim ke petugas survei.',
            'data' => $verifikasi->load(['lks', 'petugas']),
        ]);

    } catch (\Exception $e) {
        \Log::error('❌ Gagal kirim verifikasi ke petugas: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan server: ' . $e->getMessage(),
        ], 500);
    }
}

}
