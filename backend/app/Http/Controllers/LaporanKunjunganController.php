<?php

namespace App\Http\Controllers;

use App\Models\LaporanKunjungan;
use Illuminate\Http\Request;

class LaporanKunjunganController extends Controller
{
    public function index($lks_id)
    {
        return LaporanKunjungan::where('lks_id', $lks_id)->latest()->get();
    }

    public function store(Request $request, $lks_id)
    {
        $validated = $request->validate([
            'petugas' => 'required|string',
            'catatan' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        $laporan = LaporanKunjungan::create([
            'lks_id' => $lks_id,
            'petugas' => $validated['petugas'],
            'catatan' => $validated['catatan'],
            'tanggal' => $validated['tanggal'],
        ]);

        return response()->json([
            'message' => 'Laporan kunjungan disimpan.',
            'data' => $laporan
        ]);
    }
}

