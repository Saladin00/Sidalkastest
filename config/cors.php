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

    // Semua endpoint API dan autentikasi yang diizinkan lintas origin
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'lks/*', // endpoint LKS (GET/POST/PUT/DELETE)
    ],

    // Izinkan semua metode HTTP (GET, POST, PUT, DELETE, OPTIONS, dsb)
    'allowed_methods' => ['*'],

    // Domain asal (frontend) yang diizinkan
 'allowed_origins' => env('APP_ENV') === 'local'
    ? ['http://localhost:5173']
    : ['https://sidaleka.id'],

    // Tambahan pola wildcard jika butuh (kosongkan untuk dev)
    'allowed_origins_patterns' => [],

    // Izinkan semua header dikirim dari frontend
    'allowed_headers' => ['*'],

    // Header yang diekspos ke browser (biarkan kosong)
    'exposed_headers' => [],

    // Lama waktu cache preflight (OPTIONS)
    'max_age' => 0,

    // Diperlukan untuk Sanctum agar cookie dan sesi dapat digunakan
    'supports_credentials' => true,
];
