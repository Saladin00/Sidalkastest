<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LKSController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\AccountController;

use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\LaporanKunjunganController;
use App\Http\Controllers\DokumenLKSController;
use App\Http\Controllers\LksApprovalController;
use App\Http\Controllers\KecamatanController;

// 🔹 Import Verifikasi Controllers per Role
use App\Http\Controllers\Verifikasi\AdminVerifikasiController;
use App\Http\Controllers\Verifikasi\OperatorVerifikasiController;
use App\Http\Controllers\Verifikasi\PetugasVerifikasiController;
use App\Http\Controllers\Verifikasi\LksVerifikasiController;

// Laporan Controller
use App\Http\Controllers\Laporan\AdminLaporanController;
use App\Http\Controllers\Laporan\AdminLaporanExportController;
use App\Http\Controllers\Laporan\OperatorLaporanController;
use App\Http\Controllers\Laporan\OperatorLaporanExportController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/kecamatan', [KecamatanController::class, 'index']);
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);
Route::post('/resend-activation', [UserController::class, 'resendActivation']);





// ================= AKUN (SEMUA ROLE) =================
Route::middleware(['auth:sanctum'])->prefix('account')->group(function () {
    Route::get('/', [AccountController::class, 'profile']);
    Route::post('/update-email', [AccountController::class, 'updateEmail']);
    Route::post('/update-username', [AccountController::class, 'updateUsername']);
    Route::post('/update-password', [AccountController::class, 'updatePassword']);
});




/*
|--------------------------------------------------------------------------
| RESET PASSWORD (MAILPIT)
|--------------------------------------------------------------------------
*/
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

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
    | UNIVERSAL PROFILE (SEMUA ROLE)
    |--------------------------------------------------------------------------
    */
    Route::get('/lks/profile-view', [LKSController::class, 'profileView']);
    Route::get('/lks/me', [LKSController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | LKS PROFILE UPDATE (LKS & ADMIN)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:lks|admin'])->group(function () {
        Route::put('/lks/me/update', [LKSController::class, 'updateMe']);
    });

    /*
    |--------------------------------------------------------------------------
    | LKS - DOKUMEN & KUNJUNGAN
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
*
|--------------------------------------------------------------------------
| LAPORAN ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin/laporan')
    ->group(function () {
        Route::get('/', [AdminLaporanController::class, 'laporan']);
    });

    Route::middleware(['auth:sanctum','role:admin'])
    ->prefix('admin/laporan')
    ->group(function () {
        Route::get('/', [AdminLaporanController::class, 'laporan']);

        // Export
        Route::get('/export/pdf', [AdminLaporanExportController::class, 'exportPdf']);
        Route::get('/export/excel', [AdminLaporanExportController::class, 'exportExcel']);
    });

/*
|--------------------------------------------------------------------------
| LAPORAN OPERATOR
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:operator'])
    ->prefix('operator/laporan')
    ->group(function () {
        Route::get('/', [OperatorLaporanController::class, 'laporan']);

        // Export
        Route::get('/export/pdf', [OperatorLaporanExportController::class, 'exportPdf']);
        Route::get('/export/excel', [OperatorLaporanExportController::class, 'exportExcel']);
    });




    /*
    |--------------------------------------------------------------------------
    | VERIFIKASI (PER ROLE)
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:admin'])   // ⬅️ middleware lengkap
    ->group(function () {

        // 🔹 Manajemen User (ADMIN)
        Route::apiResource('users', UserController::class);

        // 🔹 Toggle Status User
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

        // 🔹 Verifikasi (ADMIN)
        Route::prefix('verifikasi')->group(function () {
            Route::get('/', [AdminVerifikasiController::class, 'index']);
            Route::get('/{id}', [AdminVerifikasiController::class, 'show']);
            Route::put('/{id}/validasi', [AdminVerifikasiController::class, 'validasiAkhir']);
            Route::get('/{id}/logs', [AdminVerifikasiController::class, 'logs']);
        });

        // 🔹 LKS Approval
        Route::get('/lks/pending', [LksApprovalController::class, 'index']);
        Route::patch('/lks/{id}/approve', [LksApprovalController::class, 'approve']);
        Route::patch('/lks/{id}/reject', [LksApprovalController::class, 'reject']);
    });


    // 🧩 OPERATOR
    Route::prefix('operator')->middleware('role:operator')->group(function () {
        Route::prefix('verifikasi')->group(function () {
            Route::get('/', [OperatorVerifikasiController::class, 'index']); // daftar verifikasi per kecamatan
            Route::get('/{id}', [OperatorVerifikasiController::class, 'show']); // detail
            Route::post('/{id}/kirim-ke-petugas', [OperatorVerifikasiController::class, 'kirimKePetugas']); // kirim ke petugas
            Route::get('/petugas/list', [OperatorVerifikasiController::class, 'listPetugas']); // ⬅️ baru
        });

        // 🔹 Operator hanya bisa aktifkan LKS di kecamatan-nya
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    });

    // 🧩 PETUGAS
    Route::prefix('petugas')->middleware('role:petugas')->group(function () {
        Route::prefix('verifikasi')->group(function () {
            Route::get('/', [PetugasVerifikasiController::class, 'index']); // daftar tugas survei
            Route::get('/{id}', [PetugasVerifikasiController::class, 'show']); // detail LKS untuk disurvei
            Route::put('/{id}/kirim-admin', [PetugasVerifikasiController::class, 'kirimKeAdmin']); // kirim hasil ke admin
        });
    });

    // 🧩 LKS
    Route::prefix('lks')->middleware('role:lks')->group(function () {
        Route::prefix('verifikasi')->group(function () {
            Route::get('/', [LksVerifikasiController::class, 'index']); // status pengajuan
            Route::get('/{id}', [LksVerifikasiController::class, 'show']); // detail hasil verifikasi
            Route::post('/pengajuan', [LksVerifikasiController::class, 'pengajuan']); // kirim pengajuan verifikasi
        });
    });

    /*
    |--------------------------------------------------------------------------
    | KLIEN (SEMUA ROLE SESUAI IZIN)
    |--------------------------------------------------------------------------
    */
    Route::apiResource('klien', KlienController::class);

    /*
    |--------------------------------------------------------------------------
    | ⚠️ API RESOURCE LKS (HARUS DI AKHIR)
    |--------------------------------------------------------------------------
    */
    Route::apiResource('lks', LKSController::class);
});
