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

        // Jika request gagal → hentikan
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

    // Panggil view yang benar (folder pdf)
    $pdf = Pdf::loadView('pdf.laporan_admin_pdf', $laporan);

    return $pdf->download('laporan-admin.pdf');
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

        // Hanya data tabel yang dikirim ke Excel
        return Excel::download(
            new AdminLaporanExport($laporan['data']),
            'laporan-admin.xlsx'
        );
    }
}
