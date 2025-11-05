<?php

namespace App\Http\Controllers;

use App\Models\Verifikasi;
use App\Models\VerifikasiLog;
use Illuminate\Http\Request;

class VerifikasiController extends Controller
{
    // 🔹 LIST (admin: semua, petugas: hanya miliknya)
    public function index(Request $r)
    {
        $q = Verifikasi::with(['lks','petugas'])->orderByDesc('created_at');

        // filter optional
        if ($r->filled('status')) $q->where('status', $r->status);
        if ($r->filled('lks_id')) $q->where('lks_id', $r->lks_id);

        // Petugas hanya lihat verifikasi miliknya
        if ($r->user()->hasRole('petugas')) {
            $q->where('petugas_id', $r->user()->id);
        }

        return response()->json($q->paginate(15));
    }

    // 🔹 DETAIL
    public function show(Request $r, $id)
    {
        $ver = Verifikasi::with(['lks','petugas','logs.user'])->findOrFail($id);

        // Batasi akses petugas hanya ke verifikasi miliknya
        if ($r->user()->hasRole('petugas') && $ver->petugas_id !== $r->user()->id) {
            return response()->json(['message'=>'Akses ditolak'], 403);
        }

        return response()->json($ver);
    }

    // 🔹 PETUGAS: Tambah hasil verifikasi + upload foto
    public function store(Request $r)
    {
        if (!$r->user()->hasRole('petugas')) {
            return response()->json(['message'=>'Akses ditolak'], 403);
        }

        $data = $r->validate([
            'lks_id'             => 'required|exists:l_k_s,id',
            'penilaian'          => 'nullable|string',
            'catatan'            => 'nullable|string',
            'tanggal_verifikasi' => 'nullable|date',
            'foto_bukti.*'       => 'image|max:4096',
        ]);

        $ver = Verifikasi::create([
            'lks_id' => $data['lks_id'],
            'petugas_id' => $r->user()->id,
            'status' => 'menunggu',
            'penilaian' => $data['penilaian'] ?? null,
            'catatan' => $data['catatan'] ?? null,
            'tanggal_verifikasi' => $data['tanggal_verifikasi'] ?? now(),
        ]);

        // Upload foto (kalau ada)
        if ($r->hasFile('foto_bukti')) {
            $paths = [];
            foreach ($r->file('foto_bukti') as $file) {
                $paths[] = $file->store("verifikasi/{$ver->id}", 'public');
            }
            $ver->update(['foto_bukti' => $paths]);

            VerifikasiLog::create([
                'verifikasi_id'=>$ver->id,'user_id'=>$r->user()->id,
                'aksi'=>'unggah_foto','keterangan'=>count($paths).' file'
            ]);
        }

        // Catat log
        VerifikasiLog::create([
            'verifikasi_id'=>$ver->id,'user_id'=>$r->user()->id,
            'aksi'=>'buat','keterangan'=>'Verifikasi dibuat oleh petugas'
        ]);

        return response()->json($ver->load('logs.user'), 201);
    }

    // 🔹 ADMIN: Ubah status akhir
    public function updateStatus(Request $r, $id)
    {
        if (!$r->user()->hasRole('admin')) {
            return response()->json(['message'=>'Akses ditolak'], 403);
        }

        $data = $r->validate([
            'status' => 'required|in:menunggu,valid,tidak_valid',
            'catatan_admin' => 'nullable|string'
        ]);

        $ver = Verifikasi::findOrFail($id);
        $ver->status = $data['status'];

        if (!empty($data['catatan_admin'])) {
            $ver->catatan = trim(($ver->catatan ? $ver->catatan."\n" : '')."[ADMIN] ".$data['catatan_admin']);
        }
        $ver->save();

        VerifikasiLog::create([
            'verifikasi_id'=>$ver->id,'user_id'=>$r->user()->id,
            'aksi'=>'update_status','keterangan'=>'Status: '.$data['status']
        ]);

        return response()->json($ver->load('logs.user'));
    }

    // 🔹 ADMIN / PETUGAS (yang sama): Upload foto tambahan
    public function uploadFoto(Request $r, $id)
    {
        $ver = Verifikasi::findOrFail($id);

        if ($r->user()->hasRole('petugas') && $ver->petugas_id !== $r->user()->id) {
            return response()->json(['message'=>'Akses ditolak'], 403);
        }

        $r->validate(['foto_bukti.*'=>'required|image|max:4096']);

        $paths = $ver->foto_bukti ?? [];
        foreach ($r->file('foto_bukti') as $file) {
            $paths[] = $file->store("verifikasi/{$ver->id}", 'public');
        }
        $ver->update(['foto_bukti'=>$paths]);

        VerifikasiLog::create([
            'verifikasi_id'=>$ver->id,'user_id'=>$r->user()->id,
            'aksi'=>'unggah_foto','keterangan'=>'Tambah '.count($r->file('foto_bukti')).' file'
        ]);

        return response()->json($ver->fresh());
    }

    // 🔹 LIHAT LOGS
    public function logs(Request $r, $id)
    {
        $ver = Verifikasi::findOrFail($id);

        if ($r->user()->hasRole('petugas') && $ver->petugas_id !== $r->user()->id) {
            return response()->json(['message'=>'Akses ditolak'], 403);
        }

        return response()->json(
            $ver->logs()->with('user')->orderByDesc('created_at')->get()
        );
    }
}
