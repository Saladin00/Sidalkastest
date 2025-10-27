<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// 🔹 Register
Route::post('/register', [AuthController::class, 'register']);
Route::get('/register', function () {
    return response()->json([
        'message' => 'Gunakan POST /api/register untuk registrasi pengguna baru.',
        'example_body' => [
            'email' => 'user@example.com',
            'password' => 'your_password'
        ]
    ]);
});

// 🔹 Login
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function () {
    return response()->json([
        'message' => 'Gunakan POST /api/login untuk login dengan email dan password.',
        'example_body' => [
            'email' => 'admin@sidalekas.go.id',
            'password' => 'admin123'
        ]
    ]);
});

// 🔹 Route yang butuh autentikasi Sanctum
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // 🔹 Hanya admin
    Route::get('/users', [UserController::class, 'index'])->middleware('role:admin');
});
