<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class CheckTokenIdleTimeout
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                $idleLimit = now()->subHours(4); // 4 jam idle timeout

                if ($accessToken->last_used_at && $accessToken->last_used_at < $idleLimit) {
                    $accessToken->delete();
                    return response()->json([
                        'message' => 'Token kadaluarsa karena tidak ada aktivitas selama 8 jam.'
                    ], 401);
                }

                // Perpanjang waktu setiap kali ada aktivitas
                $accessToken->forceFill(['last_used_at' => now()])->save();
            }
        }

        return $next($request);
    }
}
