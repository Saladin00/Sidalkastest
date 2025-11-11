<?php

/**
 * @OA\Info(
 *     title="SIDALEKAS API",
 *     version="1.0.0",
 *     description="Dokumentasi API Sistem Informasi Data Lembaga Kesejahteraan Sosial (SIDALEKAS)"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Gunakan Bearer token hasil login"
 * )
 */



namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
