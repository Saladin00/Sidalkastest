<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use Illuminate\Http\Request;

class KlienController extends Controller


{
    // 🔹 Daftar Klien
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Klien::with('lks');

        if ($user->hasRole('admin') && $request->filled('kecamatan')) {
            $query->where('kecamatan', $request->kecamatan);
        } elseif ($user->hasRole('operator')) {
            $query->where('kecamatan', $user->kecamatan);
        } elseif ($user->hasRole('lks')) {
            $query->where('lks_id', $user->lks_id);
        }

        if ($request->filled('status_bantuan')) {
            $query->where('status_bantuan', $request->status_bantuan);
        }
        if ($request->filled('jenis_kebutuhan')) {
            $query->where('jenis_kebutuhan', $request->jenis_kebutuhan);
        }

        return response()->json([
            'data' => $query->paginate(20)
        ], 200);
    }

    // 🔹 Tambah Klien
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nik' => 'required|string|max:16|unique:klien,nik',
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'kelurahan' => 'required|string',
            'kecamatan' => 'required|string',
            'lks_id' => 'nullable|exists:lks,id',
            'jenis_kebutuhan' => 'nullable|string',
            'status_bantuan' => 'nullable|string',
            'status_pembinaan' => 'nullable|string',
        ]);

        if ($user->hasRole('lks')) {
            $validated['lks_id'] = $user->lks_id;
            $validated['kecamatan'] = $user->lks->kecamatan ?? $validated['kecamatan'];
        } elseif ($user->hasRole('operator')) {
            $validated['kecamatan'] = $user->kecamatan;
        }

        $klien = Klien::create($validated);

        return response()->json([
            'message' => 'Klien berhasil ditambahkan',
            'data' => $klien
        ], 201);
    }

    // 🔹 Detail Klien
    public function show($id)
    {
        try {
            $klien = Klien::with('lks')->findOrFail($id);

            return response()->json([
                'data' => $klien
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data klien tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // 🔹 Update Klien
    public function update(Request $request, $id)
    {
        try {
            $klien = Klien::findOrFail($id);

            $validated = $request->validate([
                'nik' => 'required|string|max:16|unique:klien,nik,' . $id,
                'nama' => 'required|string|max:255',
                'alamat' => 'nullable|string',
                'kelurahan' => 'nullable|string',
                'kecamatan' => 'nullable|string',
                'jenis_kebutuhan' => 'nullable|string',
                'status_bantuan' => 'nullable|string',
                'status_pembinaan' => 'nullable|string',
            ]);

            $klien->update($validated);

            return response()->json([
                'message' => 'Data klien berhasil diperbarui',
                'data' => $klien
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui data klien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔹 Hapus Klien
    public function destroy($id)
    {
        try {
            $klien = Klien::findOrFail($id);
            $klien->delete();

            return response()->json([
                'message' => 'Klien berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus klien',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
