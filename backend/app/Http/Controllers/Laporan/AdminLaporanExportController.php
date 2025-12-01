<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\AdminLaporanExport;

class AdminLaporanExportController extends Controller
{
    private function getLaporanData(Request $request)
    {
        // Ambil data dari controller utama
        $response = app(AdminLaporanController::class)
            ->laporan($request)
            ->getData(true);

        if (!isset($response['success']) || $response['success'] !== true) {
            return [
                'success' => false,
                'message' => $response['message'] ?? 'Gagal mengambil data laporan.'
            ];
        }

        return [
            'success' => true,
            'periode' => $response['periode'],
            'range'   => $response['range'],
            'data'    => $response['data'],
        ];
    }

    public function exportPDF(Request $request)
    {
        $laporan = $this->getLaporanData($request);

        if (!$laporan['success']) {
            return response()->json([
                'success' => false,
                'message' => $laporan['message']
            ], 422);
        }

        $periode = ucfirst($laporan['periode'] ?? 'Bulan');
        $start = $laporan['range']['start'] ?? date('Y-m-d');
        $end   = $laporan['range']['end'] ?? date('Y-m-d');
        $filename = "Laporan_{$periode}_{$start}_sd_{$end}.pdf";

        $pdf = Pdf::loadView('pdf.laporan_admin_pdf', $laporan);
        return $pdf->download($filename);
    }

    public function exportExcel(Request $request)
    {
        $laporan = $this->getLaporanData($request);

        if (!$laporan['success']) {
            return response()->json([
                'success' => false,
                'message' => $laporan['message']
            ], 422);
        }

        $periode = ucfirst($laporan['periode'] ?? 'Bulan');
        $start = $laporan['range']['start'] ?? date('Y-m-d');
        $end   = $laporan['range']['end'] ?? date('Y-m-d');
        $filename = "Laporan_{$periode}_{$start}_sd_{$end}.xlsx";

        $exportData = [
            'data' => $laporan['data'],
            'periode' => $laporan['periode'],
            'range' => $laporan['range'],
        ];

        return Excel::download(new AdminLaporanExport($exportData), $filename);
    }
}