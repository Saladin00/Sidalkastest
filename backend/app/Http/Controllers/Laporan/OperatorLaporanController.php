<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lks;
use App\Models\Klien;
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

        $periode = $request->periode ?? 'bulan';
        $bulan   = $request->bulan;
        $tahun   = $request->tahun ?? now()->year;

        // ============================
        //        RANGE TANGGAL
        // ============================
        if ($periode === 'bulan') {
            $start = Carbon::create($tahun, $bulan, 1)->startOfMonth();
            $end   = Carbon::create($tahun, $bulan, 1)->endOfMonth();
        } elseif ($periode === 'triwulan') {
            $triwulan = $request->bulan;
            $start = Carbon::create($tahun, ($triwulan - 1) * 3 + 1)->startOfMonth();
            $end   = Carbon::create($tahun, $triwulan * 3)->endOfMonth();
        } else {
            $start = Carbon::create($tahun)->startOfYear();
            $end   = Carbon::create($tahun)->endOfYear();
        }

        // ============================
        //     DATA LKS (STATUS)
        // ============================
        $lksValid = Lks::where('kecamatan_id', $kecamatanId)
            ->whereRelation('verifikasiTerbaru', 'status', 'valid')
            ->count();

        $lksTidakValid = Lks::where('kecamatan_id', $kecamatanId)
            ->whereRelation('verifikasiTerbaru', 'status', 'tidak_valid')
            ->count();

        $lksProses = Lks::where('kecamatan_id', $kecamatanId)
            ->whereRelation('verifikasiTerbaru', function ($q) {
                $q->whereIn('status', ['menunggu','proses_survei','dikirim_operator','dikirim_admin']);
            })
            ->count();

        // ============================
        //       DATA KLIEN
        //  (FILTER BY PERIODE)
        // ============================

        $klienAktif = Klien::where('kecamatan_id', $kecamatanId)
            ->where('status_pembinaan', 'aktif')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $klienTidakAktif = Klien::where('kecamatan_id', $kecamatanId)
            ->where('status_pembinaan', 'selesai')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        return response()->json([
            'success' => true,
            'periode' => $periode,
            'range' => [
                'start' => $start->toDateString(),
                'end' => $end->toDateString()
            ],
            'kecamatan' => $user->kecamatan?->nama ?? '-',
            'data' => [
                'lks_valid' => $lksValid,
                'lks_tidak_valid' => $lksTidakValid,
                'lks_proses' => $lksProses,
                'klien_aktif' => $klienAktif,
                'klien_tidak_aktif' => $klienTidakAktif,
            ]
        ]);
    }
}
