<?php

namespace App\Http\Controllers;

use App\Models\Kecamatan;
use Illuminate\Http\Request;

class KecamatanController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Kecamatan::select('id', 'nama')->orderBy('nama')->get()
        ]);
    }
}
