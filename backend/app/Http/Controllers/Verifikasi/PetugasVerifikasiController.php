<?php

namespace App\Http\Controllers\Verifikasi;

use App\Http\Controllers\Controller;
use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class PetugasVerifikasiController extends Controller
{
    // 🔹 Petugas hanya lihat verifikasi miliknya
    public function index(Request $request)
    {
        $user = $request->user();

        $data = Verifikasi::with(['lks', 'klien'])
            ->where('petugas_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    // 🔹 Tambah verifikasi baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lks_id' => 'required|exists:lks,id',
            'status' => 'required|in:menunggu,valid,tidak_valid',
            'penilaian' => 'nullable|string',
            'catatan' => 'nullable|string',
            'foto_bukti' => 'nullable|array',
        ]);

        $validated['petugas_id'] = $request->user()->id;
        $validated['tanggal_verifikasi'] = now();

        $verifikasi = Verifikasi::create($validated);

        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id' => $request->user()->id,
            'aksi' => 'buat',
            'keterangan' => 'Petugas membuat verifikasi baru.',
        ]);

        return response()->json(['success' => true, 'data' => $verifikasi]);
    }

    // 🔹 Update status (petugas update hasil verifikasi)
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:valid,tidak_valid,menunggu',
            'penilaian' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $verifikasi = Verifikasi::findOrFail($id);
        $verifikasi->update([
            'status' => $request->status,
            'penilaian' => $request->penilaian,
            'catatan' => $request->catatan,
            'tanggal_verifikasi' => now(),
        ]);

        VerifikasiLog::create([
            'verifikasi_id' => $verifikasi->id,
            'user_id' => $request->user()->id,
            'aksi' => 'update',
            'keterangan' => "Petugas memperbarui hasil verifikasi menjadi {$request->status}.",
        ]);

        return response()->json(['success' => true, 'message' => 'Verifikasi diperbarui']);
    }
    public function show($id)
    {
        $data = Verifikasi::with(['lks', 'petugas'])
            ->find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $data]);
    }
}
