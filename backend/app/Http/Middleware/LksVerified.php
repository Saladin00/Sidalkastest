<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LksVerified
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();

        if ($user->hasRole('lks')) {
            $lks = $user->lks;

            // Jika data LKS tidak ada => blokir
            if (!$lks) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data LKS belum lengkap.'
                ], 403);
            }

            // Jika status verifikasi LKS belum valid => BLOKIR
            if ($lks->status_verifikasi !== 'valid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun LKS belum diverifikasi.',
                    'status_verifikasi' => $lks->status_verifikasi
                ], 403);
            }
        }

        return $next($request);
    }
}