<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\{RoleMiddleware, PermissionMiddleware, RoleOrPermissionMiddleware};
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // ✅ Aktifkan CORS
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // ✅ Daftarkan alias middleware
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'idle.timeout' => \App\Http\Middleware\CheckTokenIdleTimeout::class, // ⬅️ idle timeout
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 🔹 Semua API kembalikan JSON
        $exceptions->shouldRenderJsonWhen(fn($request, $e) => $request->is('api/*'));

        // 🔹 Error autentikasi
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['success' => false, 'message' => 'Unauthenticated. Please login first.'], 401);
            }
        });

        // 🔹 Error validasi
        $exceptions->render(function (ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $e->errors()
                ], 422);
            }
        });

        // 🔹 Error 404
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['success' => false, 'message' => 'Resource not found.'], 404);
            }
        });

        // 🔹 Error umum
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Server error.',
                    'error' => env('APP_DEBUG') ? $e->getMessage() : 'Internal Server Error',
                ], 500);
            }
        });
    })
    ->create();
