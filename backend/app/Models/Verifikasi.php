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

    public function lks()
    {
        return $this->belongsTo(LKS::class, 'lks_id');
    }

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    public function logs()
    {
        return $this->hasMany(VerifikasiLog::class,'verifikasi_id');
    }
}
