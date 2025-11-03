<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi ini menentukan request lintas-origin (CORS) yang diizinkan.
    | Ini sangat penting agar frontend React (Vite) bisa berkomunikasi dengan
    | backend Laravel Sanctum tanpa diblok oleh browser.
    |
    */

    // Semua path API, login/logout, dan Sanctum cookie
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'lks/*', // ✅ tambahkan endpoint LKS kamu juga
    ],

    // Izinkan semua metode HTTP
    'allowed_methods' => ['*'],

    // URL frontend React
    'allowed_origins' => [
        'http://localhost:5173',
    ],

    // Jika butuh pattern wildcard tambahan
    'allowed_origins_patterns' => [],

    // Izinkan semua header
    'allowed_headers' => ['*'],

    // Header tambahan yang boleh diakses oleh browser
    'exposed_headers' => [],

    // Cache preflight (OPTIONS) — biarkan 0 untuk dev
    'max_age' => 0,

    // Sanctum butuh credentials agar bisa autentikasi
    'supports_credentials' => true,
];
