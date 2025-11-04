<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 🔹 Ambil semua user (khusus admin)
    public function index(Request $request)
    {
        // Cek apakah user yang login adalah admin
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Ambil semua user beserta role-nya
        $users = User::with('roles')->orderBy('created_at', 'desc')->get();

        // Format data user agar lebih rapi
        $data = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'status_aktif' => $user->status_aktif,
                'role' => $user->roles->pluck('name')->first(),
                'created_at' => $user->created_at->format('Y-m-d H:i'),
            ];
        });

        return response()->json(['users' => $data]);
    }
    // 🔹 Tambah user baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|string',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status_aktif' => true,
        ]);

        $user->assignRole($validated['role']);

        return response()->json(['message' => 'User berhasil ditambahkan', 'user' => $user], 201);
    }

    // 🔹 Update user
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

        return response()->json(['message' => 'User berhasil diperbarui', 'user' => $user]);
    }

    // 🔹 Hapus user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }
}
