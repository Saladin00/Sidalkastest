<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class LksVerifikasiController extends Controller
{
    // 🔹 Lihat semua verifikasi milik LKS ini
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['petugas', 'logs.user'])
            ->where('lks_id', $user->lks_id)   // kalau pakai relasi user->lks_id
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
                'message' => 'Data LKS tidak ditemukan untuk akun ini.',
            ], 404);
        }

        // 🔥 BATAS MAKSIMAL PENGAJUAN (2 kali)
        $jumlahPengajuan = Verifikasi::where('lks_id', $lks->id)->count();
        if ($jumlahPengajuan >= 2) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan verifikasi dibatasi maksimal 2 kali.',
            ], 403);
        }

        // Validasi input
        $request->validate([
            'catatan'        => 'nullable|string|max:1000',
            'foto_bukti.*'   => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // Upload foto bukti
        $fotoBukti = [];
        if ($request->hasFile('foto_bukti')) {
            foreach ($request->file('foto_bukti') as $file) {
                $path = $file->store('verifikasi_lks', 'public');
                $fotoBukti[] = asset('storage/' . $path);
            }
        }

        // Update status verifikasi LKS
        $lks->update([
            'status_verifikasi' => 'menunggu_operator',
        ]);

        // Simpan verifikasi
        $verifikasi = Verifikasi::create([
            'lks_id'            => $lks->id,
            'status'            => 'menunggu',
            'penilaian'         => 'Menunggu review dari operator kecamatan.',
            'catatan'           => $request->catatan,
            'foto_bukti'        => $fotoBukti,
            'tanggal_verifikasi'=> null,
        ]);

        // Log aktivitas
        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id'       => $user->id,
            'aksi'          => 'pengajuan',
            'keterangan'    => 'LKS mengirim pengajuan verifikasi ke operator kecamatan.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan verifikasi berhasil dikirim ke operator kecamatan!',
            'data'    => $verifikasi,
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Gagal kirim pengajuan verifikasi: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Server error.',
            'error'   => $e->getMessage(),
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
}
