<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LKSController;
use App\Http\Controllers\LaporanKunjunganController;
use App\Http\Controllers\DokumenLKSController;

// ========================
// 🔹 AUTHENTIKASI
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); // endpoint login utama
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);

Route::middleware(['auth:sanctum'])->group(function () {

    // 🔐 Logout & Profil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // 👤 Daftar user (khusus admin)
    Route::get('/users', [UserController::class, 'index'])->middleware('role:admin');

    // ========================
    // 🏢 MODUL LKS
    // ========================
    Route::get('/lks', [LKSController::class, 'index']);
    Route::post('/lks', [LKSController::class, 'store']);
    Route::get('/lks/{id}', [LKSController::class, 'show']);
    Route::put('/lks/{id}', [LKSController::class, 'update']);
    Route::delete('/lks/{id}', [LKSController::class, 'destroy']);

    // ========================
    // 📎 DOKUMEN LKS
    // ========================
    Route::get('/lks/{id}/dokumen', [DokumenLKSController::class, 'index']);      // ambil semua dokumen LKS tertentu
    Route::post('/lks/dokumen', [DokumenLKSController::class, 'store']);          // upload dokumen baru
    Route::delete('/lks/dokumen/{id}', [DokumenLKSController::class, 'destroy']); // hapus dokumen
    Route::post('/lks/{id}/upload-dokumen', [LKSController::class, 'uploadDokumen']); // upload via relasi

    // ========================
    // 📋 LAPORAN KUNJUNGAN
    // ========================
    Route::get('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'index']);
    Route::post('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'store']);

    
});
