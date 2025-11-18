<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use Illuminate\Http\Request;

class OperatorVerifikasiController extends Controller
{
    // 🔹 Operator hanya lihat data di kecamatannya
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['lks', 'petugas', 'klien'])
            ->whereHas('lks', fn($q) => $q->where('kecamatan_id', $user->kecamatan_id))
            ->orderByDesc('created_at')
            ->get();

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
}
