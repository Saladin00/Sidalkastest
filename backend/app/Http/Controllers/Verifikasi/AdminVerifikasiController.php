<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class AdminVerifikasiController extends Controller
{
    // 🔹 Lihat semua data verifikasi
    public function index(Request $request)
{
    $perPage = $request->get('per_page', 10);
    $data = Verifikasi::with(['lks', 'petugas', 'klien'])
        ->orderByDesc('created_at')
        ->paginate($perPage);

    return response()->json(['success' => true, 'data' => $data]);
}

    // 🔹 Lihat detail
    public function show($id)
    {
        $data = Verifikasi::with(['lks', 'petugas', 'klien', 'logs.user'])->find($id);
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }
        return response()->json(['success' => true, 'data' => $data]);
    }

    // 🔹 Ubah status (admin bisa override semua)
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:valid,tidak_valid,menunggu',
        'catatan' => 'nullable|string',
    ]);

    try {
        $verifikasi = Verifikasi::findOrFail($id);
        $verifikasi->update([
            'status' => $request->status,
            'catatan' => $request->catatan,
        ]);

        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id' => $request->user()->id,
            'aksi' => 'update_status',
            'keterangan' => "Admin mengubah status ke {$request->status}.",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diperbarui'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan saat memperbarui status.',
            'error' => $e->getMessage(),
        ], 500);
    }
}



    public function logs($id)
    {
        $verifikasi = Verifikasi::find($id);

        if (!$verifikasi) {
            return response()->json([
                'success' => false,
                'message' => 'Data verifikasi tidak ditemukan.'
            ], 404);
        }

        $logs = VerifikasiLog::with('user')
            ->where('verifikasi_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada aktivitas log untuk verifikasi ini.'
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}
