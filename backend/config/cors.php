<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi ini memastikan frontend React (Vite) dapat terhubung ke
    | backend Laravel (API & Sanctum) tanpa diblok oleh kebijakan CORS browser.
    |
    */

    // 🔹 Semua endpoint API dan autentikasi yang diizinkan lintas origin
    'paths' => [
        'api/*',                // mencakup semua route API termasuk /api/admin/*
        'sanctum/csrf-cookie',  // untuk autentikasi Sanctum
    ],

    // 🔹 Izinkan semua metode HTTP (GET, POST, PUT, PATCH, DELETE, OPTIONS, dsb)
    'allowed_methods' => ['*'],

    // 🔹 Domain asal (frontend) yang diizinkan
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
'supports_credentials' => true,


    // 🔹 Tidak perlu pola wildcard, cukup kosongkan
    'allowed_origins_patterns' => [],

    // 🔹 Izinkan semua header dikirim dari frontend
    'allowed_headers' => ['*'],

    // 🔹 Header yang diekspos ke browser (biarkan kosong)
    'exposed_headers' => [],

    // 🔹 Lama waktu cache preflight (OPTIONS)
    'max_age' => 0,

    // 🔹 Diperlukan untuk Sanctum agar cookie dan sesi dapat digunakan
    'supports_credentials' => true,
];
