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
use App\Http\Controllers\KecamatanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);
Route::get('/kecamatan', [KecamatanController::class, 'index']);

// Protected
Route::middleware(['auth:sanctum', 'idle.timeout'])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // ===== USER (ADMIN) =====
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

    // ===== LKS =====
    Route::apiResource('lks', LKSController::class);
    Route::post('/lks/{id}/upload-dokumen', [LKSController::class, 'uploadDokumen']);
    Route::get('/lks/by-kecamatan/{id}', [LKSController::class, 'getByKecamatan']);

    // ===== DOKUMEN LKS =====
    Route::get('/lks/{id}/dokumen', [DokumenLKSController::class, 'index']);
    Route::post('/lks/dokumen', [DokumenLKSController::class, 'store']);
    Route::delete('/lks/dokumen/{id}', [DokumenLKSController::class, 'destroy']);

    // ===== KUNJUNGAN =====
    Route::get('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'index']);
    Route::post('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'store']);

    // ===== VERIFIKASI =====
    Route::get('/verifikasi', [VerifikasiController::class, 'index']);
    Route::post('/verifikasi', [VerifikasiController::class, 'store']);
    Route::get('/verifikasi/{id}', [VerifikasiController::class, 'show']);
    Route::get('/verifikasi/{id}/logs', [VerifikasiController::class, 'logs']);
    Route::put('/verifikasi/{id}/status', [VerifikasiController::class, 'updateStatus']);

    // ===== KLIEN =====
    Route::apiResource('klien', KlienController::class);

    // ===== ADMIN: APPROVAL =====
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/lks/pending', [LksApprovalController::class, 'index']);
        Route::patch('/lks/{id}/approve', [LksApprovalController::class, 'approve']);
        Route::patch('/lks/{id}/reject', [LksApprovalController::class, 'reject']);
    });
});
