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

        // relasi lks + kecamatan
        $query = Klien::with(['lks', 'kecamatan']);

        // 🔍 filter berdasarkan role user
        if ($user->hasRole('admin') && $request->filled('kecamatan_id')) {
            $query->where('kecamatan_id', $request->kecamatan_id);
        } elseif ($user->hasRole('operator')) {
            // operator hanya bisa lihat klien di kecamatannya sendiri
            $query->where('kecamatan_id', $user->kecamatan_id);
        } elseif ($user->hasRole('lks')) {
            // lks hanya bisa lihat klien di lembaganya
            $query->where('lks_id', $user->lks_id);
        }

        // 🔍 filter tambahan
        if ($request->filled('status_bantuan')) {
            $query->where('status_bantuan', $request->status_bantuan);
        }

        if ($request->filled('jenis_kebutuhan')) {
            $query->where('jenis_kebutuhan', $request->jenis_kebutuhan);
        }

        return response()->json([
            'data' => $query->latest()->paginate(20)
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
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'lks_id' => 'nullable|exists:lks,id',
            'jenis_kebutuhan' => 'nullable|string',
            'status_bantuan' => 'nullable|string',
            'status_pembinaan' => 'nullable|string',
        ]);

        // 🔐 Sesuaikan otomatis berdasarkan role
        if ($user->hasRole('lks')) {
            $validated['lks_id'] = $user->lks_id;
            $validated['kecamatan_id'] = $user->lks->kecamatan_id ?? $validated['kecamatan_id'];
        } elseif ($user->hasRole('operator')) {
            $validated['kecamatan_id'] = $user->kecamatan_id;
        }

        $klien = Klien::create($validated);

        return response()->json([
            'message' => '✅ Klien berhasil ditambahkan',
            'data' => $klien->load(['lks', 'kecamatan'])
        ], 201);
    }

    // 🔹 Detail Klien
    public function show($id)
    {
        try {
            $klien = Klien::with(['lks', 'kecamatan'])->findOrFail($id);

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
                'kecamatan_id' => 'nullable|exists:kecamatan,id',
                'lks_id' => 'nullable|exists:lks,id',
                'jenis_kebutuhan' => 'nullable|string',
                'status_bantuan' => 'nullable|string',
                'status_pembinaan' => 'nullable|string',
            ]);

            $klien->update($validated);

            return response()->json([
                'message' => '✅ Data klien berhasil diperbarui',
                'data' => $klien->load(['lks', 'kecamatan'])
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
                'message' => '🗑️ Klien berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus klien',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
