<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * 🔹 Ambil semua user
     * Admin -> semua
     * Operator -> hanya akun LKS di kecamatan-nya
     */
    public function index(Request $request)
    {
        $auth = $request->user();

        $query = User::with(['roles', 'lks', 'kecamatan'])->orderBy('created_at', 'desc');

        // 🔸 Jika operator -> hanya lihat akun LKS di kecamatan sendiri
        if ($auth->hasRole('operator')) {
            $query->whereHas('roles', fn($r) => $r->where('name', 'lks'))
                ->where('kecamatan_id', $auth->kecamatan_id);
        }

        // 🔸 Jika bukan admin/operator -> tolak akses
        elseif (!$auth->hasRole('admin')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $users = $query->get();

        $data = $users->map(function ($user) {
            $role = $user->roles->pluck('name')->first();

            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role,
                'status_aktif' => $user->status_aktif,
                'kecamatan' => $user->kecamatan
                    ? ['id' => $user->kecamatan->id, 'nama' => $user->kecamatan->nama]
                    : null,
                'created_at' => optional($user->created_at)->format('Y-m-d H:i'),
            ];
        });

        return response()->json(['users' => $data]);
    }

    /**
     * 🔹 Tambah user baru (oleh admin)
     */
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

    /**
     * 🔹 Update user
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
            'kecamatan_id' => $validated['kecamatan_id'] ?? null,
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => '✅ User berhasil diperbarui',
            'user' => $user->load('kecamatan')
        ]);
    }

    /**
     * 🔹 Hapus user (hanya admin)
     */
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
     * 🔹 Toggle aktif / nonaktif
     * Admin -> semua akun
     * Operator -> hanya akun LKS di kecamatan-nya
     */
   /**
 * 🔹 Toggle status aktif/nonaktif akun
 * - Admin bisa ubah semua
 * - Operator hanya bisa ubah LKS di kecamatan-nya
 */
public function toggleStatus(Request $request, $id)
{
    $auth = $request->user();
    $target = User::with(['roles', 'lks'])->findOrFail($id);

    // 🔒 Validasi role
    if (!$auth->hasAnyRole(['admin', 'operator'])) {
        return response()->json(['message' => 'Akses ditolak'], 403);
    }

    // 🔒 Jika operator, hanya boleh ubah LKS di kecamatannya
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

    // 🔄 Ubah status aktif user
    $target->status_aktif = !$target->status_aktif;
    $target->save();

    // 🔄 Sinkronkan juga ke tabel LKS jika user punya role LKS
    if ($target->hasRole('lks') && $target->lks) {
        $target->lks->status = $target->status_aktif ? 'aktif' : 'pending';
        $target->lks->save();
    }

    return response()->json([
        'message' => 'Status akun berhasil diperbarui.',
        'status_aktif' => $target->status_aktif,
        'lks_status' => $target->lks?->status,
    ]);
}



}
