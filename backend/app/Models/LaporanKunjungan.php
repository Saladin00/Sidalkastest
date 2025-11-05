<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanKunjungan extends Model
{
    protected $table = 'laporan_kunjungan';

    protected $fillable = [
        'lks_id', 'petugas', 'catatan', 'tanggal'
    ];

    public function lks()
    {
        return $this->belongsTo(LKS::class);
    }
}
