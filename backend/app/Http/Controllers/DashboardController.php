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
    // 📌 ADMIN DASHBOARD (FINAL SINKRON VERIFIKASI)
    // ============================================================
    private function adminDashboard()
    {
        // STATUS DIPROSES (sesuai workflow operator & petugas)
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
                // VALID
                'aktif' => Lks::whereHas('verifikasiTerbaru', function ($q) {
                    $q->where('status', 'valid');
                })->count(),

                // SEDANG DIPROSES
                'diproses' => Lks::whereHas('verifikasiTerbaru', function ($q) use ($statusesDiproses) {
                    $q->whereIn('status', $statusesDiproses);
                })->count(),

                // BELUM PERNAH DI VERIFIKASI / NULL
                'nonaktif' => Lks::whereDoesntHave('verifikasiTerbaru')
                    ->orWhereHas('verifikasiTerbaru', fn($q) => $q->whereNull('status'))
                    ->count(),
            ],

            // KLIEN (status_pembinaan)
            'total_klien' => [
                'aktif'        => Klien::where('status_pembinaan', 'aktif')->count(),
                'nonaktif'     => Klien::where('status_pembinaan', 'selesai')->count(),
            ],

            // TOTAL PETUGAS
            'total_petugas' => User::role('petugas')->count(),

            // DATA PER KECAMATAN
            'per_kecamatan' => Kecamatan::get()->map(function ($k) use ($statusesDiproses) {

                return [
                    'nama' => $k->nama,

                    'aktif' => Lks::where('kecamatan_id', $k->id)
                        ->whereHas('verifikasiTerbaru', fn($q) => $q->where('status', 'valid'))
                        ->count(),

                    'diproses' => Lks::where('kecamatan_id', $k->id)
                        ->whereHas('verifikasiTerbaru', fn($q) => $q->whereIn('status', $statusesDiproses))
                        ->count(),

                    'nonaktif' => Lks::where('kecamatan_id', $k->id)
                        ->whereDoesntHave('verifikasiTerbaru')
                        ->orWhereHas('verifikasiTerbaru', fn($q) => $q->whereNull('status'))
                        ->count(),
                ];
            })
        ]);
    }

    // ============================================================
    // 📌 OPERATOR DASHBOARD
    // ============================================================
    private function operatorDashboard($user)
{
    $idKec = $user->kecamatan_id;

    // STATUS LKS berdasarkan status_verifikasi
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

    // DATA PER KECAMATAN (khusus operator cuma 1 kecamatan)
    $perKecamatan = [
        [
            "nama" => $user->kecamatan->nama,
            "valid" => $valid,
            "diproses" => $diproses,
            "nonaktif" => $nonaktif,
        ]
    ];

    // Total klien
    $totalKlienAktif = Klien::where('kecamatan_id', $idKec)
        ->where('status_pembinaan', 'aktif')
        ->count();

    $totalKlienNonaktif = Klien::where('kecamatan_id', $idKec)
        ->where('status_pembinaan', 'selesai')
        ->count();

    return response()->json([
        'role' => 'operator',

        'total_lks' => [
            'valid' => $valid,
            'diproses' => $diproses,
            'nonaktif' => $nonaktif,
        ],

        'total_klien' => [
            'aktif' => $totalKlienAktif,
            'nonaktif' => $totalKlienNonaktif,
        ],

        // ⬅️ INI YANG BARU
        'per_kecamatan' => $perKecamatan
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
                ->whereIn('status', ['proses_survei'])
                ->count(),

            'verifikasi_selesai'  => Verifikasi::where('petugas_id', $user->id)
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
            'message' => 'Data LKS tidak ditemukan untuk akun ini.'
        ], 404);
    }

    $lks_id = $lks->id;

    // Hitung jumlah klien
    $klienAktif = Klien::where('lks_id', $lks_id)
        ->where('status_pembinaan', 'aktif')
        ->count();

    $klienNonAktif = Klien::where('lks_id', $lks_id)
        ->where('status_pembinaan', 'selesai')
        ->count();

    // Rekap jenis bantuan (field BARU: jenis_bantuan)
    $jenisBantuan = Klien::where('lks_id', $lks_id)
        ->selectRaw('jenis_bantuan, COUNT(*) as total')
        ->groupBy('jenis_bantuan')
        ->get();

    return response()->json([
        'success' => true,
        'role' => 'lks',

        'jumlah_klien' => [
            'aktif' => $klienAktif,
            'tidak_aktif' => $klienNonAktif,
        ],

        'jenis_bantuan' => $jenisBantuan,
    ]);
}

}
