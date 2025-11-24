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
        'petugas_id',
        'status',
        'penilaian',
        'catatan',
        'foto_bukti',
        'tanggal_verifikasi',
    ];

    protected $casts = [
        'foto_bukti' => 'array',
        'hasil_survei' => 'array',
        'tanggal_verifikasi' => 'datetime',
    ];

    /**
     * STATUS FLOW:
     * - dikirim_operator → LKS kirim ke operator
     * - dikirim_petugas → Operator kirim ke petugas
     * - dikirim_admin → Petugas kirim hasil ke admin
     * - valid / tidak_valid → keputusan akhir admin
     */

    public function lks() { return $this->belongsTo(Lks::class, 'lks_id'); }
    public function petugas() { return $this->belongsTo(User::class, 'petugas_id'); }
    public function logs() { return $this->hasMany(VerifikasiLog::class, 'verifikasi_id'); }
}
