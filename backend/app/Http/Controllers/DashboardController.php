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

        if ($user->hasRole('admin')) {
            return $this->adminDashboard();
        }

        if ($user->hasRole('operator')) {
            return $this->operatorDashboard($user);
        }

        if ($user->hasRole('petugas')) {
            return $this->petugasDashboard($user);
        }

        if ($user->hasRole('lks')) {
            return $this->lksDashboard($user);
        }

        return response()->json(['error' => 'Role tidak dikenali'], 403);
    }

    // ============================================================
    // 📌 PUBLIC DASHBOARD (UNTUK LANDING PAGE)
    // ============================================================
public function publicDashboard()
{
    $statusesDiproses = [
        'menunggu',
        'dikirim_operator',
        'dikirim_petugas',
        'proses_survei',
        'dikirim_admin',
        'proses_validasi'
    ];

    // HITUNG TOTAL KLIEN & PETUGAS
    $totalKlien = Klien::count();
    $totalPetugas = User::role('petugas')->count();

    // DATA PER KECAMATAN
    $kecamatan = Kecamatan::get()->map(function ($k) use ($statusesDiproses) {

        $aktif = Lks::where('kecamatan_id', $k->id)
            ->whereHas('verifikasiTerbaru', fn($q) => $q->where('status', 'valid'))
            ->count();

        $diproses = Lks::where('kecamatan_id', $k->id)
            ->whereHas('verifikasiTerbaru', fn($q) =>
                $q->whereIn('status', $statusesDiproses)
            )->count();

        $nonaktif = Lks::where('kecamatan_id', $k->id)
            ->whereDoesntHave('verifikasiTerbaru')
            ->orWhereHas('verifikasiTerbaru', fn($q) => $q->whereNull('status'))
            ->count();

        return [
            'id'     => $k->id,
            'nama'   => $k->nama,
            'jumlah' => $aktif + $diproses + $nonaktif,
        ];
    });

    return response()->json([
        'success' => true,

        // TOTAL
        'total_lks' => Lks::count(),
        'total_klien' => $totalKlien,
        'total_petugas' => $totalPetugas,

        // PER KECAMATAN
        'per_kecamatan' => $kecamatan,

        // LOKASI LKS (MAP)
        'lokasi_lks' => Lks::whereNotNull('koordinat')
            ->select('nama', 'koordinat', 'status_verifikasi', 'kecamatan_id')
            ->get()
            ->map(function ($lks) {
                $coords = explode(',', $lks->koordinat);

                return [
                    'nama'   => $lks->nama,
                    'lat'    => isset($coords[0]) ? (float) trim($coords[0]) : null,
                    'lng'    => isset($coords[1]) ? (float) trim($coords[1]) : null,
                    'status' => $lks->status_verifikasi ?? 'tidak_diketahui',
                    'kecamatan_id' => $lks->kecamatan_id
                ];
            }),
    ]);
}

    // ============================================================
    // 📌 ADMIN DASHBOARD
    // ============================================================
    private function adminDashboard()
    {
        $statusesDiproses = [
            'menunggu',
            'dikirim_operator',
            'dikirim_petugas',
            'proses_survei',
            'dikirim_admin',
            'proses_validasi',
        ];

        return response()->json([
            'role' => 'admin',

            'total_lks' => [
                'aktif' => Lks::whereHas('verifikasiTerbaru', fn($q) => $q->where('status', 'valid'))->count(),

                'diproses' => Lks::whereHas('verifikasiTerbaru', fn($q) =>
                    $q->whereIn('status', $statusesDiproses)
                )->count(),

                'nonaktif' => Lks::whereDoesntHave('verifikasiTerbaru')
                    ->orWhereHas('verifikasiTerbaru', fn($q) => $q->whereNull('status'))
                    ->count(),
            ],

            'total_klien' => [
                'aktif'    => Klien::where('status_pembinaan', 'aktif')->count(),
                'nonaktif' => Klien::where('status_pembinaan', 'selesai')->count(),
            ],

            'total_petugas' => User::role('petugas')->count(),

            'per_kecamatan' => Kecamatan::get()->map(function ($k) use ($statusesDiproses) {
                return [
                    'nama' => $k->nama,

                    'aktif' => Lks::where('kecamatan_id', $k->id)
                        ->whereHas('verifikasiTerbaru', fn($q) => $q->where('status', 'valid'))
                        ->count(),

                    'diproses' => Lks::where('kecamatan_id', $k->id)
                        ->whereHas('verifikasiTerbaru', fn($q) =>
                            $q->whereIn('status', $statusesDiproses)
                        )->count(),

                    'nonaktif' => Lks::where('kecamatan_id', $k->id)
                        ->whereDoesntHave('verifikasiTerbaru')
                        ->orWhereHas('verifikasiTerbaru', fn($q) => $q->whereNull('status'))
                        ->count(),
                ];
            }),

            'lokasi_lks' => Lks::whereNotNull('koordinat')
                ->select('nama', 'koordinat', 'status_verifikasi')
                ->get()
                ->map(function ($lks) {
                    $coords = explode(',', $lks->koordinat);

                    return [
                        'nama'   => $lks->nama,
                        'lat'    => isset($coords[0]) ? (float) trim($coords[0]) : null,
                        'lng'    => isset($coords[1]) ? (float) trim($coords[1]) : null,
                        'status' => $lks->status_verifikasi ?? 'tidak_diketahui',
                    ];
                }),
        ]);
    }

    // ============================================================
    // 📌 OPERATOR DASHBOARD
    // ============================================================
    private function operatorDashboard($user)
    {
        $idKec = $user->kecamatan_id;

        $valid = Lks::where('kecamatan_id', $idKec)
            ->where('status_verifikasi', 'valid')
            ->count();

        $diproses = Lks::where('kecamatan_id', $idKec)
            ->whereIn('status_verifikasi', [
                'menunggu',
                'dikirim_operator',
                'proses_survei',
                'dikirim_admin',
                'proses_validasi'
            ])
            ->count();

        $nonaktif = Lks::where('kecamatan_id', $idKec)
            ->where('status_verifikasi', 'tidak_valid')
            ->count();

        return response()->json([
            'role' => 'operator',

            'total_lks' => [
                'valid' => $valid,
                'diproses' => $diproses,
                'nonaktif' => $nonaktif,
            ],

            'total_klien' => [
                'aktif' => Klien::where('kecamatan_id', $idKec)->where('status_pembinaan', 'aktif')->count(),
                'nonaktif' => Klien::where('kecamatan_id', $idKec)->where('status_pembinaan', 'selesai')->count(),
            ],

            'per_kecamatan' => [
                [
                    "nama" => $user->kecamatan->nama,
                    "valid" => $valid,
                    "diproses" => $diproses,
                    "nonaktif" => $nonaktif,
                ]
            ]
        ]);
    }

    // ============================================================
    // 📌 PETUGAS DASHBOARD
    // ============================================================
    private function petugasDashboard($user)
    {
        return response()->json([
            'role' => 'petugas',

            'verifikasi_menunggu' => Verifikasi::where('petugas_id', $user->id)
                ->where('status', 'proses_survei')
                ->count(),

            'verifikasi_selesai' => Verifikasi::where('petugas_id', $user->id)
                ->where('status', 'dikirim_admin')
                ->count(),
        ]);
    }

    // ============================================================
    // 📌 LKS DASHBOARD
    // ============================================================
   private function lksDashboard($user)
{
    $lks = $user->lks;

    if (!$lks) {
        return response()->json([
            'success' => false,
            'message' => 'Data LKS tidak ditemukan.'
        ], 404);
    }

    $id = $lks->id;

    $jenis = Klien::where('lks_id', $id)
        ->selectRaw("COALESCE(jenis_bantuan, 'Tidak Ada') as jenis_bantuan, COUNT(*) as total")
        ->groupBy('jenis_bantuan')
        ->get();

    return response()->json([
        'success' => true,
        'role' => 'lks',

        'jumlah_klien' => [
            'aktif' => Klien::where('lks_id', $id)->where('status_pembinaan', 'aktif')->count(),
            'tidak_aktif' => Klien::where('lks_id', $id)->where('status_pembinaan', 'selesai')->count(),
        ],

        'jenis_bantuan' => $jenis
    ]);
}

}
