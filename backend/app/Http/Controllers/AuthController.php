<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Lks;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    // 🔹 REGISTER: khusus untuk LKS
    public function register(Request $request)
{
    $validated = $request->validate([
        'username' => 'required|string|unique:users',
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6|confirmed',
    ]);

    // Buat akun user tapi BELUM AKTIF
    $user = User::create([
        'username' => $validated['username'],
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
        'status_aktif' => false, // belum disetujui admin
    ]);

    // Role otomatis menjadi 'lks'
    $user->assignRole('lks');

    // Buat data LKS baru (status pending)
$lks = Lks::create([
    'nama' => $validated['name'],
    'jenis_layanan' => $request->jenis_layanan ?? 'Umum',
    'kecamatan' => $request->kecamatan ?? 'Belum Ditentukan',
    'status' => 'pending',
]);

// Hubungkan user ke LKS (pastikan kolom lks_id ada di users)
$user->lks_id = $lks->id;
$user->save();



    return response()->json([
        'message' => 'Pendaftaran berhasil. Akun Anda menunggu persetujuan Admin Dinsos.',
    ], 201);
}

    // 🔹 LOGIN
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // 🚫 Cek apakah sudah aktif
        if (!$user->status_aktif) {
            return response()->json([
                'message' => 'Akun Anda belum disetujui oleh Admin Dinsos.',
            ], 403);
        }

        $user->tokens()->delete(); // hapus token lama
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->getRoleNames()->first(),
        ]);
    }

    // 🔹 LOGOUT
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }

    // 🔹 PROFILE
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
}
