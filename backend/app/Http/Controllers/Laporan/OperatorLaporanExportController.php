<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Klien;
use App\Models\Verifikasi;
use App\Exports\OperatorLaporanExport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use PDF;

class OperatorLaporanExportController extends Controller
{
    /**
     * Ekspor laporan operator ke PDF
     */
    public function exportPdf(Request $request)
    {
        $laporan = $this->getLaporanData($request);

        $pdf = PDF::loadView('pdf.laporan_operator_pdf', $laporan)
            ->setPaper('a4', 'portrait');

        $fileName = 'laporan-operator-' . now()->format('Ymd_His') . '.pdf';

        // Tambahkan header CORS agar bisa diunduh dari React (Vite)
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', "attachment; filename={$fileName}")
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173');
    }

    /**
     * Ekspor laporan operator ke Excel
     */
    public function exportExcel(Request $request)
{
    $laporan = $this->getLaporanData($request);
    $fileName = 'laporan-operator-' . now()->format('Ymd_His') . '.xlsx';

    return Excel::download(new OperatorLaporanExport($laporan), $fileName);
}

    /**
     * Ambil data laporan operator (digunakan oleh PDF & Excel)
     */
    private function getLaporanData(Request $request)
    {
        $user = $request->user();
        $kecamatanId = $user->kecamatan_id;

        if (!$kecamatanId) {
            abort(400, 'Operator belum memiliki kecamatan.');
        }

        $periode = $request->periode ?? 'bulan';
        $bulan   = $request->bulan ?? now()->month;
        $tahun   = $request->tahun ?? now()->year;

        // ===== Range tanggal =====
        if ($periode === 'bulan') {
            $start = Carbon::create($tahun, $bulan, 1)->startOfMonth();
            $end   = Carbon::create($tahun, $bulan, 1)->endOfMonth();
        } elseif ($periode === 'triwulan') {
            $tw     = $request->bulan ?? ceil(now()->month / 3);
            $mulai  = ($tw - 1) * 3 + 1;
            $akhir  = $tw * 3;
            $start = Carbon::create($tahun, $mulai, 1)->startOfMonth();
            $end   = Carbon::create($tahun, $akhir, 1)->endOfMonth();
        } else {
            $start = Carbon::create($tahun)->startOfYear();
            $end   = Carbon::create($tahun)->endOfYear();
        }

        // ===== Hitung Data =====
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
            ->whereIn('status', ['menunggu', 'proses_survei', 'dikirim_operator', 'dikirim_admin'])
            ->whereBetween('tanggal_verifikasi', [$start, $end])
            ->distinct('lks_id')
            ->count('lks_id');

        $klienAktif = Klien::where('kecamatan_id', $kecamatanId)
            ->where('status_pembinaan', 'aktif')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $klienTidakAktif = Klien::where('kecamatan_id', $kecamatanId)
            ->where('status_pembinaan', 'selesai')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        // ===== Format data untuk PDF dan Excel =====
        return [
            'user' => $user,
            'operator' => $user->name,
            'kecamatan' => $user->kecamatan?->nama ?? '-',
            'periode' => ucfirst($periode),
            'tahun' => $tahun,
            'bulan' => $bulan,
            'range' => [
                'start' => $start->toDateString(),
                'end'   => $end->toDateString(),
            ],
            'tanggal_cetak' => now()->translatedFormat('d F Y H:i'),
            'data' => [
                'lks_valid' => $lksValid,
                'lks_tidak_valid' => $lksTidakValid,
                'lks_proses' => $lksProses,
                'klien_aktif' => $klienAktif,
                'klien_tidak_aktif' => $klienTidakAktif,
            ]
        ];
    }
}
