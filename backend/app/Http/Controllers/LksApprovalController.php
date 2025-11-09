<?php

namespace App\Http\Controllers;

use App\Models\Lks;
use App\Models\User;
use Illuminate\Http\Request;

class LksApprovalController extends Controller
{
    // daftar LKS yang belum disetujui
    public function index()
    {
        $pending = Lks::with('user')->where('status', 'pending')->get();
        return response()->json($pending);
    }

    // setujui LKS
    public function approve($id)
    {
        try {
            $lks = Lks::findOrFail($id);

            // update status lks
            $lks->update(['status' => 'aktif']);

            // update status user yang terkait
            $user = $lks->user;
            if ($user) {
                $user->update(['status_aktif' => true]);
            }

            return response()->json(['message' => 'Akun LKS telah disetujui dan aktif.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyetujui LKS.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // tolak LKS
    public function reject($id)
    {
        try {
            $lks = Lks::findOrFail($id);

            $lks->update(['status' => 'nonaktif']);

            $user = $lks->user;
            if ($user) {
                $user->update(['status_aktif' => false]);
            }

            return response()->json(['message' => 'Akun LKS ditolak.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menolak LKS.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
