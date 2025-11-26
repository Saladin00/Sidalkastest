<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lks;
use App\Models\Klien;
use App\Models\Verifikasi;
use Carbon\Carbon;

class OperatorLaporanController extends Controller
{
    public function laporan(Request $request)
    {
        $user = $request->user();
        $kecamatanId = $user->kecamatan_id;

        if (!$kecamatanId) {
            return response()->json([
                'success' => false,
                'message' => 'Operator belum memiliki kecamatan.'
            ], 400);
        }

        //------------------------------------------------------------
        //  Periode, Bulan, Tahun (default = bulan + tahun ini)
        //------------------------------------------------------------
        $periode = $request->periode ?? 'bulan';
        $bulan   = $request->bulan ?? now()->month;
        $tahun   = $request->tahun ?? now()->year;

        //------------------------------------------------------------
        //  RANGE TANGGAL
        //------------------------------------------------------------
        if ($periode === 'bulan') {
            $start = Carbon::create($tahun, $bulan, 1)->startOfMonth();
            $end   = Carbon::create($tahun, $bulan, 1)->endOfMonth();
        }

        elseif ($periode === 'triwulan') {
            $tw     = $request->bulan ?? ceil(now()->month / 3);
            $mulai  = ($tw - 1) * 3 + 1;
            $akhir  = $tw * 3;

            $start = Carbon::create($tahun, $mulai, 1)->startOfMonth();
            $end   = Carbon::create($tahun, $akhir, 1)->endOfMonth();
        }

        else { // TAHUN
            $start = Carbon::create($tahun)->startOfYear();
            $end   = Carbon::create($tahun)->endOfYear();
        }

        //------------------------------------------------------------
        //  LIST TAHUN LKS (untuk dropdown FE)
        //------------------------------------------------------------
        $tahunList = Verifikasi::selectRaw('YEAR(tanggal_verifikasi) as tahun')
            ->whereNotNull('tanggal_verifikasi')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        //------------------------------------------------------------
        //  LKS STATUS (pakai verifikasi terbaru)
        //------------------------------------------------------------
        $lksValid = Verifikasi::whereHas('lks', fn($q) => $q->where('kecamatan_id', $kecamatanId))
            ->where('status', 'valid')
            ->whereBetween('tanggal_verifikasi', [$start, $end])
            ->distinct('lks_id')
            ->count('lks_id');

        $lksTidakValid = Verifikasi::whereHas('lks', fn($q) => $q->where('kecamatan_id', $kecamatanId))
            ->where('status', 'tidak_valid')
            ->whereBetween('tanggal_verifikasi', [$start, $end])
            ->distinct('lks_id')
            ->count('lks_id');

        $lksProses = Verifikasi::whereHas('lks', fn($q) => $q->where('kecamatan_id', $kecamatanId))
            ->whereIn('status', ['menunggu','proses_survei','dikirim_operator','dikirim_admin'])
            ->whereBetween('tanggal_verifikasi', [$start, $end])
            ->distinct('lks_id')
            ->count('lks_id');

        //------------------------------------------------------------
        //  KLIEN (BERDASARKAN CREATED_AT)
        //------------------------------------------------------------
        $klienAktif = Klien::where('kecamatan_id', $kecamatanId)
            ->where('status_pembinaan', 'aktif')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $klienTidakAktif = Klien::where('kecamatan_id', $kecamatanId)
            ->where('status_pembinaan', 'selesai')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        //------------------------------------------------------------
        //  RETURN RESPONSE
        //------------------------------------------------------------
        return response()->json([
            'success' => true,
            'periode' => $periode,
            'tahun_list' => $tahunList,
            'range' => [
                'start' => $start->toDateString(),
                'end'   => $end->toDateString()
            ],
            'kecamatan' => $user->kecamatan?->nama ?? '-',
            'data' => [
                'lks_valid'         => $lksValid,
                'lks_tidak_valid'   => $lksTidakValid,
                'lks_proses'        => $lksProses,
                'klien_aktif'       => $klienAktif,
                'klien_tidak_aktif' => $klienTidakAktif,
            ]
        ]);
    }
}
