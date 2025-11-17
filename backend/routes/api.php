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
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/kecamatan', [KecamatanController::class, 'index']);
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'idle.timeout'])->group(function () {

    // AUTH
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------
    | UNIVERSAL: PROFILE VIEW (SEMUA ROLE BISA AKSES)
    |--------------------------------------------------------
    */
    Route::get('/lks/profile-view', [LKSController::class, 'profileView']);
    Route::get('/lks/me', [LKSController::class, 'me']);

    /*
    |--------------------------------------------------------
    | UPDATE PROFILE (HANYA ADMIN & LKS)
    |--------------------------------------------------------
    */
    Route::middleware(['role:lks|admin'])->group(function () {
        Route::put('/lks/me/update', [LKSController::class, 'updateMe']);
    });

    /*
    |--------------------------------------------------------
    | CUSTOM ROUTE LKS → HARUS DI ATAS apiResource!
    |--------------------------------------------------------
    */
    Route::post('/lks/{id}/upload-dokumen', [LKSController::class, 'uploadDokumen']);
    Route::get('/lks/by-kecamatan/{id}', [LKSController::class, 'getByKecamatan']);
    Route::get('/lks/{id}/dokumen', [DokumenLKSController::class, 'index']);
    Route::post('/lks/dokumen', [DokumenLKSController::class, 'store']);
    Route::delete('/lks/dokumen/{id}', [DokumenLKSController::class, 'destroy']);

    Route::get('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'index']);
    Route::post('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'store']);

    /*
    |--------------------------------------------------------
    | VERIFIKASI
    |--------------------------------------------------------
    */
    Route::get('/verifikasi', [VerifikasiController::class, 'index']);
    Route::post('/verifikasi', [VerifikasiController::class, 'store']);
    Route::get('/verifikasi/{id}', [VerifikasiController::class, 'show']);
    Route::get('/verifikasi/{id}/logs', [VerifikasiController::class, 'logs']);
    Route::put('/verifikasi/{id}/status', [VerifikasiController::class, 'updateStatus']);

    /*
    |--------------------------------------------------------
    | USER CRUD (ADMIN)
    |--------------------------------------------------------
    */
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

        Route::get('/lks/pending', [LksApprovalController::class, 'index']);
        Route::patch('/lks/{id}/approve', [LksApprovalController::class, 'approve']);
        Route::patch('/lks/{id}/reject', [LksApprovalController::class, 'reject']);
    });

    /*
    |--------------------------------------------------------
    | USER MANAGEMENT UNTUK OPERATOR
    |--------------------------------------------------------
    */
    Route::prefix('operator')->middleware('role:operator')->group(function () {
        // Operator: melihat akun LKS di kecamatannya
        Route::get('/users', [UserController::class, 'index']);

        // Operator: aktif/nonaktif akun LKS di kecamatannya
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    });

    /*
    |--------------------------------------------------------
    | KLIEN
    |--------------------------------------------------------
    */
    Route::apiResource('klien', KlienController::class);

    /*
    |--------------------------------------------------------
    | ⚠️ PENTING: apiResource LKS HARUS PALING BAWAH
    |--------------------------------------------------------
    */
    Route::apiResource('lks', LKSController::class);
});
