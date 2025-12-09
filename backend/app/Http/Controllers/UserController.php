<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Lks;
use App\Models\Verifikasi;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\AktivasiAkunMail;

class UserController extends Controller
{
    /**
     * LIST USERS
     */
    public function index(Request $request)
    {
        $auth = $request->user();

        $query = User::with(['roles', 'lks', 'kecamatan'])
            ->orderByDesc('created_at');

        // Operator hanya melihat LKS di kecamatannya
        if ($auth->hasRole('operator')) {
            $query->whereHas('roles', fn($r) => $r->where('name', 'lks'))
                  ->where('kecamatan_id', $auth->kecamatan_id);
        }
        elseif (!$auth->hasRole('admin')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $users = $query->get();

        $data = $users->map(fn($user) => [
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles->pluck('name')->first(),
            'status_aktif' => $user->status_aktif,
            'kecamatan' => $user->kecamatan?->only(['id', 'nama']),
            'created_at' => $user->created_at->format('Y-m-d H:i'),
        ]);

        return response()->json(['users' => $data]);
    }

    /**
     * CREATE USER (ADMIN)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:operator,petugas,lks',
            'kecamatan_id' => 'nullable|exists:kecamatan,id',
        ]);

        // Semua user selalu nonaktif dulu
        $user = User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status_aktif' => false,
            'kecamatan_id' => $validated['kecamatan_id'],
        ]);

        $user->assignRole($validated['role']);

        /**
         * ======================================
         *  ROLE LKS → TIDAK PAKAI AKTIVASI EMAIL
         * ======================================
         */
        if ($validated['role'] === 'lks') {
            Lks::create([
                'nama' => $validated['name'],
                'jenis_layanan' => '',
                'kecamatan_id' => $validated['kecamatan_id'],
                'status' => 'nonaktif',
                'user_id' => $user->id,
            ]);

            return response()->json([
                'message' => 'Akun LKS berhasil dibuat. Silakan aktifkan akun tersebut.',
                'user' => $user
            ], 201);
        }

        /**
         * ======================================
         *  ROLE OPERATOR / PETUGAS → AKTIVASI EMAIL
         * ======================================
         */
        $token = Str::uuid()->toString();

        $user->update([
            'activation_code' => $token,
            'activation_token_expires_at' => now()->addMinutes(30),
        ]);

        Mail::to($user->email)->send(new AktivasiAkunMail($user));

        return response()->json([
            'message' => 'Akun berhasil dibuat. Link aktivasi telah dikirim.',
            'user' => $user
        ], 201);
    }

    /**
     * UPDATE USER
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'username' => 'required|string|unique:users,username,' . $id,
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|string',
            'status_aktif' => 'required|boolean',
            'kecamatan_id' => 'nullable|exists:kecamatan,id',
        ]);

        $user->update([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status_aktif' => $validated['status_aktif'],
            'kecamatan_id' => $validated['kecamatan_id'],
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'user' => $user
        ]);
    }

    /**
     * DELETE USER
     */
    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }

    /**
     * TOGGLE STATUS USER
     */
    public function toggleStatus(Request $request, $id)
    {
        $auth = $request->user();
        $target = User::with(['roles', 'lks'])->findOrFail($id);

        if (!$auth->hasAnyRole(['admin', 'operator'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        if ($auth->hasRole('operator')) {
            if (!$target->hasRole('lks') ||
                $target->kecamatan_id !== $auth->kecamatan_id) 
            {
                return response()->json([
                    'message' => 'Anda tidak boleh mengubah status user ini.'
                ], 403);
            }
        }

        // Toggle status aktif
        $target->status_aktif = !$target->status_aktif;
        $target->save();

        // Sinkronkan ke LKS
        if ($target->hasRole('lks') && $target->lks) {
            $target->lks->status = $target->status_aktif ? 'aktif' : 'nonaktif';
            $target->lks->save();
        }

        return response()->json([
            'message' => 'Status akun diperbarui.',
            'status_aktif' => $target->status_aktif
        ]);
    }

    /**
     * ====================================================
     *  AKTIVASI AKUN (untuk operator & petugas)
     * ====================================================
     */
    public function aktivasiAkun($token)
    {
        $user = User::where('activation_code', $token)->first();

        if (!$user) {
            return view('aktivasi.gagal', [
                'pesan' => 'Token tidak valid atau sudah digunakan.'
            ]);
        }

        // token expired?
        if ($user->activation_token_expires_at && $user->activation_token_expires_at->isPast()) {
            return view('aktivasi.gagal', [
                'pesan' => 'Token sudah kedaluwarsa, minta admin kirim ulang.'
            ]);
        }

        // kalau sudah aktif
        if ($user->status_aktif) {
            return view('aktivasi.sukses');
        }

        // aktifkan user
        $user->update([
            'status_aktif' => true,
            'activation_code' => null,
            'activation_token_expires_at' => null,
            'email_verified_at' => now(),
        ]);

        return view('aktivasi.sukses');
    }

    /**
     * KIRIM ULANG LINK AKTIVASI
     */
    public function resendActivation(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->status_aktif) {
            return response()->json(['message' => 'Akun sudah aktif.'], 400);
        }

        $token = Str::uuid()->toString();

        $user->update([
            'activation_code' => $token,
            'activation_token_expires_at' => now()->addMinutes(30),
        ]);

        Mail::to($user->email)->send(new AktivasiAkunMail($user));

        return response()->json([
            'message' => 'Link aktivasi baru telah dikirim.'
        ]);
    }
}
