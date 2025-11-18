<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verifikasi extends Model
{
    use HasFactory;

    protected $table = 'verifikasi';

    protected $fillable = [
        'lks_id',
        'klien_id',
        'petugas_id',
        'status',
        'penilaian',
        'catatan',
        'foto_bukti',
        'tanggal_verifikasi',
    ];

    protected $casts = [
        'foto_bukti' => 'array',
        'tanggal_verifikasi' => 'datetime',
    ];

    /* ----------------------------
     * 🔗 RELASI
     * ---------------------------- */

    // LKS yang diverifikasi
    public function lks()
    {
        return $this->belongsTo(Lks::class, 'lks_id');
    }

    // Petugas yang melakukan verifikasi
    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    // Klien yang diverifikasi (opsional)
    public function klien()
    {
        return $this->belongsTo(Klien::class, 'klien_id');
    }

    // Log aktivitas verifikasi
    public function logs()
    {
        return $this->hasMany(VerifikasiLog::class, 'verifikasi_id');
    }
}
