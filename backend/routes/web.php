<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LKSController;

Route::get('/', function () {
    return view('welcome');
});

// 🖨️ Route cetak PDF LKS
Route::get('/lks/{id}/cetak-pdf', [LKSController::class, 'cetakProfil']);
