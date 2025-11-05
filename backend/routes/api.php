<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LKSController;
use App\Http\Controllers\LaporanKunjunganController;
use App\Http\Controllers\DokumenLKSController;
use App\Http\Controllers\VerifikasiController;

// ========================
// 🔹 AUTHENTIKASI
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); // Endpoint login utama

// Cetak profil LKS (tanpa login)
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);

// ========================
// 🔒 ROUTE DENGAN AUTENTIKASI
// ========================
Route::middleware(['auth:sanctum'])->group(function () {

    // ========================
    // 👤 AUTENTIKASI & PROFIL
    // ========================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // ========================
    // 👥 MANAJEMEN USER (ADMIN)
    // ========================
    Route::get('/users', [UserController::class, 'index']);       // Lihat semua user
    Route::post('/users', [UserController::class, 'store']);      // Tambah user
    Route::put('/users/{id}', [UserController::class, 'update']); // Edit user
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Hapus user

    // ========================
    // 🏢 MODUL LKS
    // ========================
    Route::get('/lks', [LKSController::class, 'index']);       // List semua LKS
    Route::post('/lks', [LKSController::class, 'store']);      // Tambah LKS
    Route::get('/lks/{id}', [LKSController::class, 'show']);   // Detail LKS
    Route::put('/lks/{id}', [LKSController::class, 'update']); // Update LKS
    Route::delete('/lks/{id}', [LKSController::class, 'destroy']); // Hapus LKS

    // ========================
    // 📎 DOKUMEN LKS
    // ========================
    Route::get('/lks/{id}/dokumen', [DokumenLKSController::class, 'index']);      // Ambil semua dokumen LKS
    Route::post('/lks/dokumen', [DokumenLKSController::class, 'store']);          // Upload dokumen baru
    Route::delete('/lks/dokumen/{id}', [DokumenLKSController::class, 'destroy']); // Hapus dokumen
    Route::post('/lks/{id}/upload-dokumen', [LKSController::class, 'uploadDokumen']); // Upload via relasi

    // ========================
    // 📋 LAPORAN KUNJUNGAN
    // ========================
    Route::get('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'index']); // List kunjungan
    Route::post('/lks/{id}/kunjungan', [LaporanKunjunganController::class, 'store']); // Tambah laporan kunjungan

    // ========================
    // 🔍 MODUL VERIFIKASI (Admin & Petugas)
    // ========================
    Route::get('/verifikasi', [VerifikasiController::class, 'index']);           // List verifikasi (admin/petugas)
    Route::get('/verifikasi/{id}', [VerifikasiController::class, 'show']);       // Detail verifikasi

    Route::post('/verifikasi', [VerifikasiController::class, 'store']);          // Tambah verifikasi baru (petugas)
    Route::post('/verifikasi/{id}/foto', [VerifikasiController::class, 'uploadFoto']); // Upload foto tambahan

    Route::put('/verifikasi/{id}/status', [VerifikasiController::class, 'updateStatus']); // Admin ubah status
    Route::get('/verifikasi/{id}/logs', [VerifikasiController::class, 'logs']);           // Riwayat log aktivitas
});
