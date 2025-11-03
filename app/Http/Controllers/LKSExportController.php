<?php

namespace App\Http\Controllers;

use App\Models\LKS;
use App\Models\LaporanKunjungan;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class LKSExportController extends Controller
{
    // GET /api/lks/{id}/cetak
    public function cetak($id)
    {
        $lks = LKS::findOrFail($id);
        $laporan = LaporanKunjungan::where('lks_id', $id)->latest()->get();

        $pdf = Pdf::loadView('pdf.lks_profil', compact('lks', 'laporan'));

        return $pdf->download("Profil_LKS_{$lks->nama}.pdf");
    }
}
