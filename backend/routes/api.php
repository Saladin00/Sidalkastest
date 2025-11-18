<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LKSController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\LaporanKunjunganController;
use App\Http\Controllers\DokumenLKSController;
use App\Http\Controllers\LksApprovalController;
use App\Http\Controllers\KecamatanController;

// 🔹 Import Verifikasi Controllers per Role
use App\Http\Controllers\Verifikasi\AdminVerifikasiController;
use App\Http\Controllers\Verifikasi\OperatorVerifikasiController;
use App\Http\Controllers\Verifikasi\PetugasVerifikasiController;
use App\Http\Controllers\Verifikasi\LksVerifikasiController;

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

    // 🔹 AUTH
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | UNIVERSAL: PROFILE VIEW (SEMUA ROLE BISA AKSES)
    |--------------------------------------------------------------------------
    */
    Route::get('/lks/profile-view', [LKSController::class, 'profileView']);
    Route::get('/lks/me', [LKSController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | UPDATE PROFILE (HANYA ADMIN & LKS)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:lks|admin'])->group(function () {
        Route::put('/lks/me/update', [LKSController::class, 'updateMe']);
    });

    /*
    |--------------------------------------------------------------------------
    | CUSTOM ROUTE LKS → HARUS DI ATAS apiResource!
    |--------------------------------------------------------------------------
    */
    Route::post('/lks/{id}/upload-dokumen', [LKSController::class, 'uploadDokumen']);
    Route::get('/lks/by-kecamatan/{id}', [LKSController::class, 'getByKecamatan']);
    Route::get('/lks/{id}/dokumen', [DokumenLKSController::class, 'index']);
    Route::post('/lks/dokumen', [DokumenLKSController::class, 'store']);
    Route::delete('/lks/dokumen/{id}', [DokumenLKSController::class, 'destroy']);

    Route::get('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'index']);
    Route::post('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | VERIFIKASI (Dipisah per Role)
    |--------------------------------------------------------------------------
    */
    // 🧩 ADMIN
    //*
// |--------------------------------------------------------------------------
// | VERIFIKASI (Dipisah per Role)
// |--------------------------------------------------------------------------
// */

// ADMIN
Route::prefix('admin')->middleware('role:admin')->group(function () {
    Route::prefix('verifikasi')->group(function () {
        Route::get('/', [AdminVerifikasiController::class, 'index']);
        Route::get('/{id}', [AdminVerifikasiController::class, 'show']);
        Route::get('/{id}/logs', [AdminVerifikasiController::class, 'logs']);
        Route::put('/{id}/status', [AdminVerifikasiController::class, 'updateStatus']);
    });
});

// OPERATOR
Route::prefix('operator')->middleware('role:operator')->group(function () {
    Route::prefix('verifikasi')->group(function () {
        Route::get('/', [OperatorVerifikasiController::class, 'index']);
        Route::get('/{id}', [OperatorVerifikasiController::class, 'show']);
    });
});

// PETUGAS
Route::prefix('petugas')->middleware('role:petugas')->group(function () {
    Route::prefix('verifikasi')->group(function () {
        Route::get('/', [PetugasVerifikasiController::class, 'index']);
        Route::post('/', [PetugasVerifikasiController::class, 'store']);
        Route::get('/{id}', [PetugasVerifikasiController::class, 'show']);
        Route::put('/{id}', [PetugasVerifikasiController::class, 'update']);
    });
});

// LKS
Route::prefix('lks')->middleware('role:lks')->group(function () {
    Route::prefix('verifikasi')->group(function () {
        Route::get('/', [LksVerifikasiController::class, 'index']);
        Route::get('/{id}', [LksVerifikasiController::class, 'show']);
        Route::get('/status', [LksVerifikasiController::class, 'status']);
    });
});

    /*
    |--------------------------------------------------------------------------
    | USER CRUD (ADMIN)
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

        Route::get('/lks/pending', [LksApprovalController::class, 'index']);
        Route::patch('/lks/{id}/approve', [LksApprovalController::class, 'approve']);
        Route::patch('/lks/{id}/reject', [LksApprovalController::class, 'reject']);
    });

    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT UNTUK OPERATOR
    |--------------------------------------------------------------------------
    */
    Route::prefix('operator')->middleware('role:operator')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    });

    /*
    |--------------------------------------------------------------------------
    | KLIEN
    |--------------------------------------------------------------------------
    */
    Route::apiResource('klien', KlienController::class);

    /*
    |--------------------------------------------------------------------------
    | ⚠️ PENTING: apiResource LKS HARUS PALING BAWAH
    |--------------------------------------------------------------------------
    */
    Route::apiResource('lks', LKSController::class);
});
