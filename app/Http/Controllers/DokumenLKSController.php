<?php

namespace App\Http\Controllers;

use App\Models\DokumenLKS;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokumenLKSController extends Controller
{
    public function index($lks_id)
    {
        return DokumenLKS::where('lks_id', $lks_id)->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'lks_id' => 'required|exists:l_k_s,id',
            'nama' => 'required|string',
            'file' => 'required|file|max:2048',
        ]);

        $path = $request->file('file')->store('dokumen_lks');

        $dokumen = DokumenLKS::create([
            'lks_id' => $request->lks_id,
            'nama' => $request->nama,
            'path' => $path,
        ]);

        return response()->json(['message' => 'Dokumen berhasil diupload', 'data' => $dokumen]);
    }

    public function destroy($id)
    {
        $dokumen = DokumenLKS::findOrFail($id);
        Storage::delete($dokumen->path);
        $dokumen->delete();

        return response()->json(['message' => 'Dokumen berhasil dihapus']);
    }
}
