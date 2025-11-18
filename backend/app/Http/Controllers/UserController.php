<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Verifikasi;

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
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:operator,petugas',
            'kecamatan_id' => 'nullable|exists:kecamatan,id',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status_aktif' => true,
            'kecamatan_id' => $validated['kecamatan_id'] ?? null,
        ]);

        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'Akun berhasil dibuat oleh admin',
            'user' => $user->load('kecamatan'),
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

        if (!$auth->hasRole('admin')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

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
}
