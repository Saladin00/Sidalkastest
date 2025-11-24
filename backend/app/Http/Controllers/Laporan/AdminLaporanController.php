<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lks;
use App\Models\Klien;
use App\Models\Kecamatan;
use App\Models\Verifikasi;
use Carbon\Carbon;
use App\Exports\AdminLaporanExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;




class AdminLaporanController extends Controller
{
   public function laporan(Request $request)
{
    $periode = $request->periode ?? 'bulan';
    $tahun   = $request->tahun ?? now()->year;

    // ==========================
    // BULAN (opsional)
    // ==========================
    $bulan = $request->bulan ? intval($request->bulan) : null;

    // ==========================
    // RANGE BERDASARKAN PERIODE
    // ==========================
    if ($periode === 'bulan') {

        if (!$bulan) {
            return response()->json([
                'success' => false,
                'message' => "Bulan wajib dipilih untuk laporan bulanan."
            ], 422);
        }

        $start = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $end   = Carbon::create($tahun, $bulan, 1)->endOfMonth();
    }

    elseif ($periode === 'triwulan') {

        if (!$bulan || !in_array($bulan, [1,2,3,4])) {
            return response()->json([
                'success' => false,
                'message' => "Triwulan harus 1–4."
            ], 422);
        }

        $mulai = ($bulan - 1) * 3 + 1;
        $akhir = $bulan * 3;

        $start = Carbon::create($tahun, $mulai, 1)->startOfMonth();
        $end   = Carbon::create($tahun, $akhir, 1)->endOfMonth();
    }

    else { // TAHUNAN
        $start = Carbon::create($tahun)->startOfYear();
        $end   = Carbon::create($tahun)->endOfYear();
    }

    $kecamatan = Kecamatan::all();
    $data = [];

    foreach ($kecamatan as $kec) {

        $lksValid = Verifikasi::whereBetween('tanggal_verifikasi', [$start, $end])
            ->where('status', 'valid')
            ->whereHas('lks', fn($q) => $q->where('kecamatan_id', $kec->id))
            ->distinct('lks_id')
            ->count('lks_id');

        $lksTidakValid = Verifikasi::whereBetween('tanggal_verifikasi', [$start, $end])
            ->where('status', 'tidak_valid')
            ->whereHas('lks', fn($q) => $q->where('kecamatan_id', $kec->id))
            ->distinct('lks_id')
            ->count('lks_id');

        $lksProses = Verifikasi::whereBetween('tanggal_verifikasi', [$start, $end])
            ->whereIn('status', ['menunggu','proses_survei','dikirim_operator','dikirim_admin'])
            ->whereHas('lks', fn($q) => $q->where('kecamatan_id', $kec->id))
            ->distinct('lks_id')
            ->count('lks_id');

        // KLIEN
        $klienAktif = Klien::where('kecamatan_id', $kec->id)
            ->where('status_pembinaan', 'aktif')
            ->count();

        $klienTidakAktif = Klien::where('kecamatan_id', $kec->id)
            ->where('status_pembinaan', 'selesai')
            ->count();

        $data[] = [
            'kecamatan'        => $kec->nama,
            'lks_valid'        => $lksValid,
            'lks_tidak_valid'  => $lksTidakValid,
            'lks_proses'       => $lksProses,
            'klien_aktif'      => $klienAktif,
            'klien_tidak_aktif'=> $klienTidakAktif,
        ];
    }

    return response()->json([
        'success' => true,
        'periode' => $periode,
        'range' => [
            'start' => $start->toDateString(),
            'end'   => $end->toDateString(),
        ],
        'data' => $data
    ]);
}

    public function exportPdf(Request $request)
{
    $laporan = $this->laporan($request)->getData();

    $pdf = Pdf::loadView('pdf.laporan-admin', [
        'data' => $laporan->data,
        'range' => $laporan->range,
        'periode' => $laporan->periode
    ]);

    return $pdf->download('laporan-admin.pdf');
}

public function exportExcel(Request $request)
{
    return Excel::download(new AdminLaporanExport($request), 'laporan-admin.xlsx');
}


}
