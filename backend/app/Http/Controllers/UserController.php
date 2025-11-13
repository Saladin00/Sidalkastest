<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * 🔹 Ambil semua user (khusus admin)
     */
    public function index(Request $request)
    {
        // 🔒 Hanya admin yang boleh
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Ambil semua user dengan relasi roles dan kecamatan (jika ada)
       $users = User::with(['roles', 'lks', 'kecamatan'])
    ->orderBy('created_at', 'desc')
    ->get();


        $data = $users->map(function ($user) {
    $role = $user->roles->pluck('name')->first();

    return [
        'id' => $user->id,
        'username' => $user->username,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $role,
        'status_aktif' => $user->status_aktif,
        'kecamatan' => $user->kecamatan ? ['id' => $user->kecamatan->id, 'nama' => $user->kecamatan->nama] : null, // ✅ tambahkan ini
        'created_at' => optional($user->created_at)->format('Y-m-d H:i'),
    ];
});

        return response()->json(['users' => $data]);
    }

    /**
     * 🔹 Tambah user baru (oleh admin)
     */
    public function store(Request $request)
{
    // 🔒 Hanya admin boleh
    if (!$request->user()->hasRole('admin')) {
        return response()->json(['message' => 'Akses ditolak'], 403);
    }

    $validated = $request->validate([
        'username' => 'required|string|unique:users',
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
        'role' => 'required|in:operator,petugas', // hanya boleh dua role ini
        'kecamatan_id' => 'nullable|exists:kecamatan,id', // ✅ tambahkan ini
    ]);

    // 🧩 Buat akun user
    $user = User::create([
        'username' => $validated['username'],
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'status_aktif' => true,
        'kecamatan_id' => $validated['kecamatan_id'] ?? null, // ✅ simpan kecamatan
    ]);

    // 🏷️ Assign role
    $user->assignRole($validated['role']);

    return response()->json([
        'message' => 'Akun berhasil dibuat oleh admin',
        'user' => $user->load('kecamatan'), // ✅ kirim juga relasi kecamatan ke frontend
    ], 201);
}


    /**
     * 🔹 Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'username' => 'required|string|unique:users,username,' . $id,
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|string',
            'status_aktif' => 'required|boolean',
            'kecamatan_id' => 'nullable|exists:kecamatan,id',
        ]);

        $user->update([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status_aktif' => $validated['status_aktif'],
            'kecamatan_id' => $validated['kecamatan_id'] ?? null,
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => '✅ User berhasil diperbarui',
            'user' => $user->load('kecamatan')
        ]);
    }

    /**
     * 🔹 Hapus user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => '🗑️ User berhasil dihapus']);
    }

    /**
     * 🔹 Toggle aktif / nonaktif
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->status_aktif = !$user->status_aktif;
        $user->save();

        return response()->json([
            'message' => 'Status akun berhasil diperbarui',
            'status_aktif' => $user->status_aktif
        ]);
    }
}
