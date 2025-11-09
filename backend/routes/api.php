<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LKSController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\LaporanKunjunganController;
use App\Http\Controllers\DokumenLKSController;
use App\Http\Controllers\VerifikasiController;
use App\Http\Controllers\LksApprovalController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Semua endpoint API aplikasi disusun dengan rapi di bawah ini.
| Pastikan hanya user yang sudah login (auth:sanctum) yang bisa
| mengakses endpoint yang membutuhkan autentikasi.
|
*/

// ========================
// 🔹 AUTHENTIKASI (PUBLIC)
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);

// ========================
// 🔐 ROUTE PROTECTED (auth:sanctum)
// ========================
Route::middleware(['auth:sanctum'])->group(function () {

    // 🔸 Logout & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // ========================
    // 👥 MANAJEMEN USER (ADMIN)
    // ========================
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

    // ========================
    // 🏢 MODUL LKS
    // ========================
    Route::get('/lks', [LKSController::class, 'index']);
    Route::post('/lks', [LKSController::class, 'store']);
    Route::get('/lks/{id}', [LKSController::class, 'show']);
    Route::put('/lks/{id}', [LKSController::class, 'update']);
    Route::delete('/lks/{id}', [LKSController::class, 'destroy']);
    Route::post('/lks/{id}/upload-dokumen', [LKSController::class, 'uploadDokumen']);

    // ========================
    // 📎 DOKUMEN LKS
    // ========================
    Route::get('/lks/{id}/dokumen', [DokumenLKSController::class, 'index']);
    Route::post('/lks/dokumen', [DokumenLKSController::class, 'store']);
    Route::delete('/lks/dokumen/{id}', [DokumenLKSController::class, 'destroy']);

    // ========================
    // 📋 LAPORAN KUNJUNGAN
    // ========================
    Route::get('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'index']);
    Route::post('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'store']);

    // ========================
    // 🔍 VERIFIKASI LKS
    // ========================
    Route::get('/verifikasi', [VerifikasiController::class, 'index']);
    Route::get('/verifikasi/{id}', [VerifikasiController::class, 'show']);

    // ========================
    // 👤 DATA KLIEN
    // ========================
    Route::get('/klien', [KlienController::class, 'index']);
    Route::post('/klien', [KlienController::class, 'store']);
    Route::get('/klien/{id}', [KlienController::class, 'show']);
    Route::put('/klien/{id}', [KlienController::class, 'update']);
    Route::delete('/klien/{id}', [KlienController::class, 'destroy']);

    // ========================
    // 🧩 ADMIN: Persetujuan LKS
    // ========================
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/lks/pending', [LksApprovalController::class, 'index']);
        Route::patch('/lks/{id}/approve', [LksApprovalController::class, 'approve']);
        Route::patch('/lks/{id}/reject', [LksApprovalController::class, 'reject']);
    });
});
