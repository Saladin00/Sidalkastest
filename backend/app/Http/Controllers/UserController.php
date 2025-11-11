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
        // 🔒 Pastikan hanya admin yang bisa akses
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // 🔍 Ambil semua user dengan relasi roles dan LKS
        $users = User::with(['roles', 'lks'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 🎨 Format data untuk frontend
        $data = $users->map(function ($user) {
            $role = $user->roles->pluck('name')->first();

            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role,
                'status_aktif' => $user->status_aktif,

                // 🔗 Data LKS (jika role = lks)
                'lks_id' => $user->lks?->id,
                'lks_nama' => $user->lks?->nama,
                'lks_status' => $user->lks?->status,
                'lks_kecamatan' => $user->lks?->kecamatan,

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
        ]);

        // 🧩 Buat akun user
        $user = User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status_aktif' => true,
        ]);

        // 🏷️ Assign role
        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'Akun berhasil dibuat oleh admin',
            'user' => $user
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
        ]);

        $user->update([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status_aktif' => $validated['status_aktif'],
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'user' => $user
        ]);
    }

    /**
     * 🔹 Hapus user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }

    /**
     * 🔹 Toggle status aktif / nonaktif (untuk manajemen user)
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
