<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OperatorLaporanExport;

class OperatorLaporanExportController extends Controller
{
    /**
     * Ambil data laporan operator dari controller utama
     */
    private function getLaporanData(Request $request)
    {
        $response = app(OperatorLaporanController::class)
            ->laporan($request)
            ->getData(true);

        if (!isset($response['success']) || $response['success'] !== true) {
            return [
                'success' => false,
                'message' => $response['message'] ?? 'Gagal mengambil data laporan operator.'
            ];
        }

        return [
            'success'   => true,
            'kecamatan' => $response['kecamatan'],
            'periode'   => $response['periode'] ?? '-',
            'range'     => $response['range'] ?? null,
            'data'      => $response['data'],
        ];
    }

    /**
     * Export PDF
     */
    public function exportPDF(Request $request)
    {
        $laporan = $this->getLaporanData($request);

        if (!$laporan['success']) {
            return response()->json([
                'success' => false,
                'message' => $laporan['message']
            ], 422);
        }

        // View PDF berada di: resources/views/pdf/laporan_operator_pdf.blade.php
        $pdf = Pdf::loadView('pdf.laporan_operator_pdf', $laporan);

        return $pdf->download('laporan-operator.pdf');
    }

    /**
     * Export Excel
     */
    public function exportExcel(Request $request)
    {
        $laporan = $this->getLaporanData($request);

        if (!$laporan['success']) {
            return response()->json([
                'success' => false,
                'message' => $laporan['message']
            ], 422);
        }

        return Excel::download(
            new OperatorLaporanExport($laporan),
            'laporan-operator.xlsx'
        );
    }
}
