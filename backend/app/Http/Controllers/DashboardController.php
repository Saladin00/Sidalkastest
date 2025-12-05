<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lks;
use App\Models\Klien;
use App\Models\User;
use App\Models\Kecamatan;
use App\Models\Verifikasi;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return $this->adminDashboard();
        }

        if ($user->role === 'operator') {
            return $this->operatorDashboard($user);
        }

        if ($user->role === 'petugas') {
            return $this->petugasDashboard($user);
        }

        if ($user->role === 'lks') {
            return $this->lksDashboard($user);
        }

        return response()->json(['error' => 'Role tidak dikenali'], 403);
    }

    private function adminDashboard()
{
    return response()->json([
        'role' => 'admin',

        // TOTAL LKS
        'total_lks' => [
            'aktif'        => Lks::where('status', 'aktif')->count(),
            'nonaktif'     => Lks::where('status', 'nonaktif')->count(),
            'pending'      => Lks::where('status', 'pending')->count(),
        ],

        // TOTAL KLIEN
        'total_klien' => [
            'aktif'        => Klien::where('status', 'aktif')->count(),
            'nonaktif'     => Klien::where('status', 'nonaktif')->count(),
        ],

        // TOTAL PETUGAS
        'total_petugas' => User::where('role', 'petugas')->count(),

        // DATA PER KECAMATAN
        'per_kecamatan' => Kecamatan::withCount([
            'lks as aktif'     => fn($q) => $q->where('status', 'aktif'),
            'lks as nonaktif'  => fn($q) => $q->where('status', 'nonaktif'),
            'lks as pending'   => fn($q) => $q->where('status', 'pending'),
        ])
        ->get()
        ->map(fn($k) => [
            'nama'     => $k->nama,
            'aktif'    => $k->aktif,
            'nonaktif' => $k->nonaktif,
            'pending'  => $k->pending,
        ])
    ]);
}

    private function operatorDashboard($user)
    {
        $idKec = $user->kecamatan_id;

        return response()->json([
            'role' => 'operator',

            'total_lks' => [
                'aktif'        => Lks::where('kecamatan_id', $idKec)->where('status','aktif')->count(),
                'tidak_aktif'  => Lks::where('kecamatan_id', $idKec)->where('status','tidak_aktif')->count(),
                'diproses'     => Lks::where('kecamatan_id', $idKec)->where('status','diproses')->count(),
            ],

            'total_klien' => [
                'aktif'        => Klien::where('kecamatan_id', $idKec)->where('status','aktif')->count(),
                'tidak_aktif'  => Klien::where('kecamatan_id', $idKec)->where('status','tidak_aktif')->count(),
            ]
        ]);
    }

    private function petugasDashboard($user)
    {
        return response()->json([
            'role' => 'petugas',
            'verifikasi_menunggu' => Verifikasi::where('petugas_id', $user->id)->where('status','menunggu')->count(),
            'verifikasi_selesai'  => Verifikasi::where('petugas_id', $user->id)->where('status','valid')->count(),
        ]);
    }

    private function lksDashboard($user)
    {
        $lks_id = $user->lks_id;

        return response()->json([
            'role' => 'lks',
            'jumlah_klien' => [
                'aktif' => Klien::where('lks_id', $lks_id)->where('status','aktif')->count(),
                'tidak_aktif' => Klien::where('lks_id', $lks_id)->where('status','tidak_aktif')->count(),
            ],
            'jenis_bantuan' => Klien::where('lks_id', $lks_id)
                ->selectRaw('jenis_bantuan, count(*) as total')
                ->groupBy('jenis_bantuan')
                ->get()
        ]);
    }
}
