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
        $bulan   = $request->bulan ? intval($request->bulan) : null;

        // ===============================
        // DAFTAR TAHUN VERIFIKASI
        // ===============================
        $tahunList = Verifikasi::selectRaw('YEAR(tanggal_verifikasi) as tahun')
            ->whereNotNull('tanggal_verifikasi')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // ===============================
        // RANGE LAPORAN
        // ===============================
        if ($periode === 'bulan') {
            if (!$bulan) {
                return response()->json([
                    'success' => false,
                    'message' => "Bulan wajib dipilih untuk laporan bulanan."
                ], 422);
            }
            $start = Carbon::create($tahun, $bulan, 1)->startOfMonth();
            $end   = Carbon::create($tahun, $bulan, 1)->endOfMonth();
        } elseif ($periode === 'triwulan') {
            if (!$bulan || !in_array($bulan, [1, 2, 3, 4])) {
                return response()->json([
                    'success' => false,
                    'message' => "Triwulan harus 1–4."
                ], 422);
            }
            $mulai = ($bulan - 1) * 3 + 1;
            $akhir = $bulan * 3;
            $start = Carbon::create($tahun, $mulai, 1)->startOfMonth();
            $end   = Carbon::create($tahun, $akhir, 1)->endOfMonth();
        } else {
            $start = Carbon::create($tahun)->startOfYear();
            $end   = Carbon::create($tahun)->endOfYear();
        }

        // ===============================
        // REKAP DATA PER KECAMATAN
        // ===============================
        $data = [];
        foreach (Kecamatan::all() as $kec) {
            $lksList = Lks::where('kecamatan_id', $kec->id)->get();

            $valid = $tidakValid = $proses = 0;
            foreach ($lksList as $lks) {
                $verif = Verifikasi::where('lks_id', $lks->id)
                    ->whereNotNull('tanggal_verifikasi')
                    ->orderByDesc('tanggal_verifikasi')
                    ->first();

                if (!$verif) continue;
                if ($verif->tanggal_verifikasi < $start || $verif->tanggal_verifikasi > $end) continue;

                if ($verif->status === 'valid') $valid++;
                elseif ($verif->status === 'tidak_valid') $tidakValid++;
                else $proses++;
            }

            $klienAktif = Klien::where('kecamatan_id', $kec->id)
                ->where('status_pembinaan', 'aktif')
                ->whereBetween('created_at', [$start, $end])
                ->count();

            $klienTidakAktif = Klien::where('kecamatan_id', $kec->id)
                ->where('status_pembinaan', 'selesai')
                ->whereBetween('created_at', [$start, $end])
                ->count();

            $data[] = [
                'kecamatan'        => $kec->nama,
                'lks_valid'        => $valid,
                'lks_tidak_valid'  => $tidakValid,
                'lks_proses'       => $proses,
                'klien_aktif'      => $klienAktif,
                'klien_tidak_aktif'=> $klienTidakAktif,
            ];
        }

        return response()->json([
            'success'     => true,
            'tahun_list'  => $tahunList,
            'periode'     => $periode,
            'range'       => [
                'start' => $start->toDateString(),
                'end'   => $end->toDateString(),
            ],
            'data'        => $data
        ]);
    }

    // ===============================
    // EXPORT PDF
    // ===============================
    public function exportPdf(Request $request)
    {
        $laporan = $this->laporan($request)->getData();

        $periode = ucfirst($laporan->periode ?? 'Bulan');
        $start = $laporan->range->start ?? date('Y-m-d');
        $end   = $laporan->range->end ?? date('Y-m-d');

        $filename = "Laporan_{$periode}_{$start}_sd_{$end}.pdf";

        $pdf = Pdf::loadView('pdf.laporan_admin_pdf', [
            'data'    => $laporan->data,
            'range'   => (array) $laporan->range,
            'periode' => $laporan->periode,
        ]);

        return $pdf->download($filename);
    }

    // ===============================
    // EXPORT EXCEL
    // ===============================
    public function exportExcel(Request $request)
    {
        // Ambil data laporan
        $laporan = $this->laporan($request)->getData(true);

        if (!isset($laporan['success']) || $laporan['success'] !== true) {
            return response()->json([
                'success' => false,
                'message' => $laporan['message'] ?? 'Gagal mengambil data laporan.'
            ], 422);
        }

        // Tentukan nama file
        $periode = ucfirst($laporan['periode'] ?? 'Bulan');
        $start = $laporan['range']['start'] ?? date('Y-m-d');
        $end   = $laporan['range']['end'] ?? date('Y-m-d');
        $filename = "Laporan_{$periode}_{$start}_sd_{$end}.xlsx";

        // Struktur data untuk Export class
        $exportData = [
            'data' => $laporan['data'],
            'periode' => $laporan['periode'],
            'range' => $laporan['range'],
        ];

        return Excel::download(new AdminLaporanExport($exportData), $filename);
    }
}
