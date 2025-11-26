<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    // 🔹 Ambil data akun login
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    // 🔹 Update email
    public function updateEmail(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id
        ]);

        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Email berhasil diperbarui.'
        ]);
    }

    // 🔹 Update username
    public function updateUsername(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'username' => 'required|string|unique:users,username,' . $user->id
        ]);

        $user->username = $validated['username'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Username berhasil diperbarui.'
        ]);
    }

    // 🔹 Update password
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed'
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama salah.'
            ], 400);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diperbarui.'
        ]);
    }
}
