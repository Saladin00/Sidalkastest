<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use Illuminate\Http\Request;

class LksVerifikasiController extends Controller
{
    // 🔹 LKS hanya bisa melihat hasil verifikasi miliknya
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['petugas', 'logs.user'])
            ->where('lks_id', $user->lks_id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    // 🔹 Detail
    public function show($id)
    {
        $data = Verifikasi::with(['petugas', 'logs.user'])->find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json(['success' => true, 'data' => $data]);
    }
}
