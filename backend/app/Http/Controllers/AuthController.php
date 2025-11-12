<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Lks;
use App\Models\Verifikasi;

class AuthController extends Controller
{
    // 🔹 REGISTER: otomatis buat akun LKS, data LKS, & verifikasi awal
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'jenis_layanan' => 'required|string',
            'kecamatan_id' => 'required|exists:kecamatan,id', // ✅ ubah ke ID, bukan string
        ]);

        // ✅ 1. Buat akun user (status pending)
        $user = User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'status_aktif' => false,
        ]);

        // ✅ 2. Beri role "lks"
        $user->assignRole('lks');

        // ✅ 3. Buat data LKS baru (hubungkan dengan user & kecamatan)
        $lks = Lks::create([
            'nama' => $validated['name'],
            'jenis_layanan' => $validated['jenis_layanan'],
            'kecamatan_id' => $validated['kecamatan_id'], // ✅ simpan relasi foreign key
            'status' => 'pending',
            'user_id' => $user->id, // pastikan tabel lks punya kolom user_id
        ]);

        // ✅ 4. Hubungkan user ke LKS (via kolom lks_id di tabel users)
        $user->lks_id = $lks->id;
        $user->save();

        // ✅ 5. Buat verifikasi awal otomatis (langsung ke petugas pertama, atau fallback ke user)
        $petugas = User::whereHas('roles', fn($q) => $q->where('name', 'petugas'))->first();

        Verifikasi::create([
            'lks_id' => $lks->id,
            'petugas_id' => $petugas?->id ?? $user->id,
            'status' => 'menunggu',
            'penilaian' => 'Menunggu proses verifikasi.',
            'catatan' => 'Verifikasi otomatis dibuat saat registrasi LKS.',
            'tanggal_verifikasi' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => '✅ Pendaftaran berhasil. Akun Anda menunggu persetujuan Admin Dinsos.',
            'user' => $user,
            'lks' => $lks->load('kecamatan'), // ✅ sekalian kirim data kecamatan-nya
        ], 201);
    }

    // 🔹 LOGIN
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        if (!$user->status_aktif) {
            return response()->json(['message' => 'Akun Anda belum disetujui oleh Admin Dinsos.'], 403);
        }

        $user->tokens()->delete();
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
