<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use Illuminate\Http\Request;

class KlienController extends Controller
{
    // ============================
    // LIST KLIEN
    // ============================
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Klien::with(['lks', 'kecamatan']);

        // ROLE FILTER
        if ($user->hasRole('admin')) {
            // admin bebas, hanya ikut filter frontend
        } 
        elseif ($user->hasRole('operator')) {
            // operator hanya lihat klien kecamatannya
            $query->where('kecamatan_id', $user->kecamatan_id);
        } 
        elseif ($user->hasRole('lks')) {
            // lks hanya lihat klien lembaganya
            $query->where('lks_id', $user->lks_id);
        }

        // FILTER TAMBAHAN
        if ($request->filled('kecamatan_id')) {
            $query->where('kecamatan_id', $request->kecamatan_id);
        }

        if ($request->filled('lks_id')) {
            $query->where('lks_id', $request->lks_id);
        }

        if ($request->filled('status_bantuan')) {
            $query->where('status_bantuan', $request->status_bantuan);
        }

        if ($request->filled('jenis_kebutuhan')) {
            $query->where('jenis_kebutuhan', $request->jenis_kebutuhan);
        }

        $data = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'data' => $data
        ]);
    }

    // ============================
    // CREATE
    // ============================
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nik' => 'required|string|max:16|unique:klien,nik',
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'kelurahan' => 'required|string',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'lks_id' => 'nullable|exists:lks,id',
            'jenis_kebutuhan' => 'nullable|string',
            'status_bantuan' => 'nullable|string',
            'status_pembinaan' => 'nullable|string',
        ]);

        // ROLE OVERRIDE OTOMATIS
        if ($user->hasRole('lks')) {
            $validated['lks_id'] = $user->lks_id;
            $validated['kecamatan_id'] = $user->lks->kecamatan_id;
        } elseif ($user->hasRole('operator')) {
            $validated['kecamatan_id'] = $user->kecamatan_id;
        }

        $klien = Klien::create($validated);

        return response()->json([
            'message' => 'Klien berhasil ditambahkan',
            'data' => $klien->load(['lks', 'kecamatan'])
        ], 201);
    }

    // ============================
    // DETAIL
    // ============================
    public function show($id)
    {
        $klien = Klien::with(['lks', 'kecamatan'])->find($id);

        if (!$klien) {
            return response()->json([
                'message' => 'Klien tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'data' => $klien
        ]);
    }

    // ============================
    // UPDATE
    // ============================
    public function update(Request $request, $id)
    {
        $klien = Klien::find($id);

        if (!$klien) {
            return response()->json(['message' => 'Klien tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'nik' => "required|string|max:16|unique:klien,nik,$id",
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan_id' => 'nullable|exists:kecamatan,id',
            'lks_id' => 'nullable|exists:lks,id',
            'jenis_kebutuhan' => 'nullable|string',
            'status_bantuan' => 'nullable|string',
            'status_pembinaan' => 'nullable|string',
        ]);

        $klien->update($validated);

        return response()->json([
            'message' => 'Data klien diperbarui',
            'data' => $klien->load(['lks', 'kecamatan'])
        ]);
    }

    // ============================
    // DELETE
    // ============================
    public function destroy($id)
    {
        $klien = Klien::find($id);

        if (!$klien) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $klien->delete();

        return response()->json([
            'message' => 'Klien berhasil dihapus'
        ]);
    }
}
