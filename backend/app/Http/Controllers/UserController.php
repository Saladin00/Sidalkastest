<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Verifikasi;
use Illuminate\Support\Str;
use App\Mail\AktivasiAkunMail;
use Illuminate\Support\Facades\Mail;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $auth = $request->user();

        $query = User::with(['roles', 'lks', 'kecamatan'])->orderByDesc('created_at');

        if ($auth->hasRole('operator')) {
            $query->whereHas('roles', fn($r) => $r->where('name', 'lks'))
                ->where('kecamatan_id', $auth->kecamatan_id);
        } elseif (!$auth->hasRole('admin')) {
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
            'kecamatan' => $user->kecamatan
                ? ['id' => $user->kecamatan->id, 'nama' => $user->kecamatan->nama]
                : null,
            'created_at' => optional($user->created_at)->format('Y-m-d H:i'),
        ]);

        return response()->json(['users' => $data]);
    }

  public function store(Request $request)
{
    \Log::info("🔥 STORE USER DIPANGGIL");

    $validated = $request->validate([
        'username' => 'required|string|unique:users',
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
        'role' => 'required|in:operator,petugas',
        'kecamatan_id' => 'nullable|exists:kecamatan,id',
    ]);

    // 🔥 Token dibuat di sini
   $token = Str::uuid()->toString();


    // 🔥 Log token SETELAH dibuat
    \Log::info("🔥 TOKEN GENERATED", ['token' => $token]);

    // 🔥 Buat user (create)
    $user = User::create([
        'username' => $validated['username'],
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'status_aktif' => false,
        'activation_code' => $token,

        'activation_token_expires_at' => now()->addMinutes(30),
        'kecamatan_id' => $validated['kecamatan_id'] ?? null,
    ]);

    // 🔥 Log hasil user setelah create
    \Log::info("🔥 USER SAVED", $user->toArray());

    $user->assignRole($validated['role']);
    Mail::to($user->email)->send(new AktivasiAkunMail($user));

    return response()->json([
        'message' => 'Akun berhasil dibuat. Link aktivasi telah dikirim.',
        'user' => $user
    ], 201);
}




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
            'kecamatan_id' => $validated['kecamatan_id'] ?? null,
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => '✅ User berhasil diperbarui',
            'user' => $user->load('kecamatan'),
        ]);
    }

    public function destroy($id)
    {
        $auth = request()->user();


        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => '🗑️ User berhasil dihapus']);
    }

    /**
     * 🔹 Toggle status aktif/nonaktif akun + sinkronisasi LKS & Verifikasi
     */
    public function toggleStatus(Request $request, $id)
    {
        $auth = $request->user();
        $target = User::with(['roles', 'lks'])->findOrFail($id);

        if (!$auth->hasAnyRole(['admin', 'operator'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        if ($auth->hasRole('operator')) {
            if (
                !$target->hasRole('lks') ||
                $target->kecamatan_id !== $auth->kecamatan_id
            ) {
                return response()->json([
                    'message' => 'Anda hanya boleh mengubah status akun LKS di kecamatan Anda sendiri.'
                ], 403);
            }
        }

        $target->status_aktif = !$target->status_aktif;
        $target->save();

        // Sinkron ke LKS dan Verifikasi
        if ($target->hasRole('lks') && $target->lks) {
            $target->lks->status = $target->status_aktif ? 'aktif' : 'pending';
            $target->lks->save();

            $verifikasi = Verifikasi::where('lks_id', $target->lks->id)->first();
            if ($verifikasi) {
                $verifikasi->status = $target->status_aktif ? 'menunggu' : 'tidak_valid';
                $verifikasi->save();
            }
        }

        return response()->json([
            'message' => 'Status akun berhasil diperbarui.',
            'status_aktif' => $target->status_aktif,
            'lks_status' => $target->lks?->status,
        ]);
    }


public function aktivasiAkun($token)
{
    $user = User::where('activation_code', $token)->first();

    if (!$user) {
        return view('aktivasi.gagal', ['pesan' => 'Token tidak valid atau sudah digunakan.']);
    }

    if ($user->activation_token_expires_at && $user->activation_token_expires_at->isPast()) {
        return view('aktivasi.gagal', [
    'pesan' => 'Token tidak valid atau sudah digunakan.'
]);

    }

    if ($user->status_aktif) {
        return view('aktivasi.sukses');
    }

    $user->update([
        'status_aktif' => true,
        'activation_code' => null,
        'activation_token_expires_at' => null,
        'email_verified_at' => now(),
    ]);

    return view('aktivasi.sukses');
}
 




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
