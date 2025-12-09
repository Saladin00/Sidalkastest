<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LKSController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;

use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\DokumenLKSController;
use App\Http\Controllers\LaporanKunjunganController;
use App\Http\Controllers\KecamatanController;
use App\Http\Controllers\LksApprovalController;

// Laporan
use App\Http\Controllers\Laporan\AdminLaporanController;
use App\Http\Controllers\Laporan\AdminLaporanExportController;
use App\Http\Controllers\Laporan\OperatorLaporanController;
use App\Http\Controllers\Laporan\OperatorLaporanExportController;

// Verifikasi
use App\Http\Controllers\Verifikasi\AdminVerifikasiController;
use App\Http\Controllers\Verifikasi\OperatorVerifikasiController;
use App\Http\Controllers\Verifikasi\PetugasVerifikasiController;
use App\Http\Controllers\Verifikasi\LksVerifikasiController;

use App\Http\Controllers\Public\PublicDashboardController;


// =====================================================================
// PUBLIC ROUTES
// =====================================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/kecamatan', [KecamatanController::class, 'index']);
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);
Route::post('/resend-activation', [UserController::class, 'resendActivation']);

Route::middleware(['auth:sanctum', 'idle.timeout'])->get('/dashboard', [DashboardController::class, 'index']);


// =====================================================================
// AUTH
// =====================================================================
Route::middleware(['auth:sanctum'])->group(function () {

    Route::prefix('account')->group(function () {
        Route::get('/', [AccountController::class, 'profile']);
        Route::post('/update-email', [AccountController::class, 'updateEmail']);
        Route::post('/update-username', [AccountController::class, 'updateUsername']);
        Route::post('/update-password', [AccountController::class, 'updatePassword']);
    });

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


// =====================================================================
// RESET PASSWORD
// =====================================================================
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);


// =====================================================================
// PROTECTED ROUTES (auth + idle timeout)
// =====================================================================
Route::middleware(['auth:sanctum', 'idle.timeout'])->group(function () {

    // ================================================================
    // LKS → Verifikasi
    // ================================================================
    Route::prefix('lks/verifikasi')->middleware('role:lks')->group(function () {
        Route::get('/', [LksVerifikasiController::class, 'index']);
        Route::get('/{id}', [LksVerifikasiController::class, 'show']);
        Route::post('/pengajuan', [LksVerifikasiController::class, 'pengajuan']);
    });

    // ================================================================
    // LKS → Profil
    // ================================================================
    Route::prefix('lks')->middleware('role:lks')->group(function () {
        Route::get('/me', [LKSController::class, 'me']);
        Route::put('/me/update', [LKSController::class, 'updateMe']);
        Route::get('/profile-view', [LKSController::class, 'profileView']);
    });

    // ================================================================
    // LKS → Fitur wajib verified
    // ================================================================
    Route::prefix('lks')->middleware(['role:lks', 'lks.verified'])->group(function () {

        // Dokumen
        Route::post('/{id}/upload-dokumen', [LKSController::class, 'uploadDokumen']);
        Route::get('/{id}/dokumen', [DokumenLKSController::class, 'index']);
        Route::post('/dokumen', [DokumenLKSController::class, 'store']);
        Route::delete('/dokumen/{id}', [DokumenLKSController::class, 'destroy']);

        // Kunjungan
        Route::get('/{id}/kunjungan', [LaporanKunjunganController::class, 'index']);
        Route::post('/{id}/kunjungan', [LaporanKunjunganController::class, 'store']);
    });


    // ================================================================
    // ADMIN
    // ================================================================
    Route::prefix('admin')->middleware('role:admin')->group(function () {

        Route::apiResource('users', UserController::class);
        Route::patch('users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

        // Verifikasi
        Route::prefix('verifikasi')->group(function () {
            Route::get('/', [AdminVerifikasiController::class, 'index']);
            Route::get('/{id}', [AdminVerifikasiController::class, 'show']);
            Route::put('/{id}/validasi', [AdminVerifikasiController::class, 'validasiAkhir']);
            Route::get('/{id}/logs', [AdminVerifikasiController::class, 'logs']);
        });

        // Approval LKS
        Route::get('/lks/pending', [LksApprovalController::class, 'index']);
        Route::patch('/lks/{id}/approve', [LksApprovalController::class, 'approve']);
        Route::patch('/lks/{id}/reject', [LksApprovalController::class, 'reject']);
    });


    // ================================================================
    // OPERATOR
    // ================================================================
    Route::prefix('operator')->middleware('role:operator')->group(function () {

        Route::prefix('verifikasi')->group(function () {
            Route::get('/', [OperatorVerifikasiController::class, 'index']);
            Route::get('/{id}', [OperatorVerifikasiController::class, 'show']);
            Route::post('/{id}/kirim-ke-petugas', [OperatorVerifikasiController::class, 'kirimKePetugas']);
            Route::get('/petugas/list', [OperatorVerifikasiController::class, 'listPetugas']);
        });

        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    });


    // ================================================================
    // PETUGAS
    // ================================================================
    Route::prefix('petugas')->middleware('role:petugas')->group(function () {
        Route::prefix('verifikasi')->group(function () {
            Route::get('/', [PetugasVerifikasiController::class, 'index']);
            Route::get('/{id}', [PetugasVerifikasiController::class, 'show']);
            Route::put('/{id}/kirim-admin', [PetugasVerifikasiController::class, 'kirimKeAdmin']);
        });
    });


    // ================================================================
    // KLIEN
    // ================================================================
    Route::get('/klien', [KlienController::class, 'index']);
    Route::post('/klien', [KlienController::class, 'store']);
    Route::get('/klien/{id}', [KlienController::class, 'show']);
    Route::put('/klien/{id}', [KlienController::class, 'update']);
    Route::delete('/klien/{id}', [KlienController::class, 'destroy']);


    // ================================================================
    // LAPORAN ADMIN
    // ================================================================
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {

        // JSON
        Route::get('/laporan', [AdminLaporanController::class, 'laporan']);

        // Export
        Route::get('/laporan/export/pdf', [AdminLaporanExportController::class, 'exportPDF']);
        Route::get('/laporan/export/excel', [AdminLaporanExportController::class, 'exportExcel']);
    });

    // ================================================================
    // LAPORAN OPERATOR
    // ================================================================
    Route::prefix('operator')->middleware(['role:operator'])->group(function () {

        // JSON
        Route::get('/laporan', [OperatorLaporanController::class, 'laporan']);

        // Export
        Route::get('/laporan/export/pdf', [OperatorLaporanExportController::class, 'exportPdf']);
        Route::get('/laporan/export/excel', [OperatorLaporanExportController::class, 'exportExcel']);
    });


    // ================================================================
    // Tambahan dari origin/main
    // LKS by kecamatan
    // ================================================================
    Route::get('/lks/by-kecamatan/{id}', [LKSController::class, 'getByKecamatan']);


    // ================================================================
    // LKS RESOURCE
    // ================================================================
    Route::apiResource('lks', LKSController::class);
});


// =====================================================================
// PUBLIC DASHBOARD
// =====================================================================
Route::prefix('public')->group(function () {
    Route::get('/dashboard', [PublicDashboardController::class, 'index']);
});
