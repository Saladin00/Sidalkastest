<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use Illuminate\Http\Request;

class KlienController extends Controller
{
    /**
     * Tampilkan daftar klien (otomatis filter berdasarkan role)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Klien::with(['lks', 'kecamatan']);

        if ($user->hasRole('admin')) {
            // Admin: akses penuh
        } elseif ($user->hasRole('operator')) {
            $query->where('kecamatan_id', $user->kecamatan_id);
        } elseif ($user->hasRole('lks')) {
            $query->where('lks_id', $user->lks_id);
        }

        // Filter tambahan opsional
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
        if ($request->filled('kelurahan')) {
        $query->where('kelurahan', 'like', '%' . $request->kelurahan . '%');
        }
        if ($request->filled('lks_id')) {
        $query->where('lks_id', $request->lks_id);
        }

        return response()->json([
            'data' => $query->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Simpan klien baru
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Default validasi dasar
        $rules = [
            'nik' => 'required|string|max:16|unique:klien,nik',
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'kelurahan' => 'required|string',
            'jenis_kebutuhan' => 'nullable|string',
            'status_bantuan' => 'nullable|string',
            'status_pembinaan' => 'nullable|string',
        ];

        // Role admin & operator wajib isi lks_id / kecamatan_id
        if ($user->hasRole('admin')) {
            $rules['lks_id'] = 'required|exists:lks,id';
            $rules['kecamatan_id'] = 'required|exists:kecamatan,id';
        } elseif ($user->hasRole('operator')) {
            $rules['lks_id'] = 'required|exists:lks,id';
        }

        $validated = $request->validate($rules);

        // Isi otomatis berdasarkan role
        if ($user->hasRole('lks')) {
            $validated['lks_id'] = $user->lks_id;
            $validated['kecamatan_id'] = $user->lks->kecamatan_id;
        } elseif ($user->hasRole('operator')) {
            $validated['kecamatan_id'] = $user->kecamatan_id;
        }

        $klien = Klien::create($validated);

        return response()->json([
            'message' => 'Klien berhasil ditambahkan',
            'data' => $klien->load(['lks', 'kecamatan']),
        ], 201);
    }

    /**
     * Tampilkan detail klien
     */
    public function show($id)
    {
        $klien = Klien::with(['lks', 'kecamatan'])->find($id);
        if (!$klien) {
            return response()->json(['message' => 'Klien tidak ditemukan'], 404);
        }

        return response()->json(['data' => $klien]);
    }

    /**
     * Update data klien
     */
    public function update(Request $request, $id)
    {
        $klien = Klien::find($id);
        $user = $request->user();

        if (!$klien) {
            return response()->json(['message' => 'Klien tidak ditemukan'], 404);
        }

        // LKS hanya boleh edit datanya sendiri
        if ($user->hasRole('lks') && $klien->lks_id !== $user->lks_id) {
            return response()->json(['message' => 'Tidak diizinkan mengedit klien dari LKS lain'], 403);
        }

        $validated = $request->validate([
            'nik' => "required|string|max:16|unique:klien,nik,$id",
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'jenis_kebutuhan' => 'nullable|string',
            'status_bantuan' => 'nullable|string',
            'status_pembinaan' => 'nullable|string',
        ]);

        // Isi otomatis untuk role LKS / operator
        if ($user->hasRole('lks')) {
            $validated['lks_id'] = $user->lks_id;
            $validated['kecamatan_id'] = $user->lks->kecamatan_id;
        } elseif ($user->hasRole('operator')) {
            $validated['kecamatan_id'] = $user->kecamatan_id;
        }

        $klien->update($validated);

        return response()->json([
            'message' => 'Data klien berhasil diperbarui',
            'data' => $klien->load(['lks', 'kecamatan']),
        ]);
    }

    /**
     * Hapus klien
     */
    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $klien = Klien::find($id);

        if (!$klien) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // LKS hanya boleh hapus klien miliknya sendiri
        if ($user->hasRole('lks') && $klien->lks_id !== $user->lks_id) {
            return response()->json(['message' => 'Tidak diizinkan menghapus klien dari LKS lain'], 403);
        }

        $klien->delete();

        return response()->json(['message' => 'Klien berhasil dihapus']);
    }
}
