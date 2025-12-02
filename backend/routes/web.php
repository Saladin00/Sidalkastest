<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LKSController;
use App\Http\Controllers\UserController;


Route::get('/', function () {
    return view('welcome');
});

// 🖨️ Route cetak PDF LKS
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);


Route::get('/aktivasi/{token}', [UserController::class, 'aktivasiAkun'])
    ->name('aktivasi');
Route::post('/resend-aktivasi', [UserController::class, 'resendActivation']);



