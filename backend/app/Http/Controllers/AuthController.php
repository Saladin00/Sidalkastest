<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Lks;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'jenis_layanan' => 'required|string',
            'kecamatan_id' => 'required|exists:kecamatan,id',
        ]);

        $user = User::create([
            'username'     => $validated['username'],
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'password'     => bcrypt($validated['password']),
            'status_aktif' => false,
            'kecamatan_id' => $validated['kecamatan_id'],
        ]);

        $user->assignRole('lks');

        $lks = Lks::create([
            'nama'             => $validated['name'],
            'jenis_layanan'    => $validated['jenis_layanan'],
            'kecamatan_id'     => $validated['kecamatan_id'],
            'status_verifikasi'=> 'belum_verifikasi',
            'status'           => 'pending',
            'user_id'          => $user->id,
        ]);

        $user->lks_id = $lks->id;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil. Menunggu aktivasi dari Operator/Admin.',
            'lks'     => $lks->load('kecamatan'),
        ], 201);
    }


    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        if (!$user->status_aktif) {
            return response()->json([
                'message'         => 'Akun Anda belum diaktifkan.',
                'need_activation' => true
            ], 403);
        }

        $lks = $user->lks_id ? Lks::find($user->lks_id) : null;

        // FIX: samakan default dengan yang digunakan di FE
        $statusVerifikasi = $lks->status_verifikasi ?? 'belum_verifikasi';

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'kecamatan_id'      => $user->kecamatan_id,
                'lks_id'            => $user->lks_id,
                'role'              => $user->getRoleNames()->first(),
                'status_verifikasi' => $statusVerifikasi,
            ],
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }


    public function profile(Request $request)
    {
        $user = $request->user();
        $lks = $user->lks_id ? Lks::find($user->lks_id) : null;

        return response()->json([
            'user' => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'kecamatan_id'      => $user->kecamatan_id,
                'lks_id'            => $user->lks_id,
                'role'              => $user->getRoleNames()->first(),
                'status_verifikasi' => $lks->status_verifikasi ?? 'belum_verifikasi',
            ],
            'roles'       => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
}

