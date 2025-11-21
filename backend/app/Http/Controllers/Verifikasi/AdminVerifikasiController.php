<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class AdminVerifikasiController extends Controller
{
    public function index(Request $request)
    {
        $data = Verifikasi::with(['lks', 'petugas'])
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

    // 🔹 Validasi akhir
    public function validasiAkhir(Request $request, $id)
    {
        $validated = $request->validate([
            'status'  => 'required|in:valid,tidak_valid',
            'catatan' => 'nullable|string',
        ]);

        $verifikasi = Verifikasi::with('lks')->findOrFail($id);

        // Update verifikasi
        $verifikasi->update([
            'status'  => $validated['status'],
            'catatan' => $validated['catatan'] ?? '',
        ]);

        // Update LKS status_verifikasi
        $lks = $verifikasi->lks;

        if ($validated['status'] === 'valid') {
            $lks->update([
                'status_verifikasi' => 'valid',
            ]);
        } else {
            $lks->update([
                'status_verifikasi' => 'tidak_valid',
            ]);
        }

        // Log
        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id'       => $request->user()->id,
            'aksi'          => 'validasi_akhir',
            'keterangan'    => "Admin menetapkan hasil verifikasi sebagai {$validated['status']}.",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status verifikasi berhasil ditetapkan.',
        ]);
    }
}
