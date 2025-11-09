<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Klien extends Model
{
    protected $table = 'klien';
    protected $fillable = [
        'nik', 
        'nama', 
        'alamat', 
        'kecamatan', 
        'kelurahan', 
        'lks_id', 
        'jenis_kebutuhan', 
        'status_bantuan', 
        'status_pembinaan', 
        'dokumen'
    ];

    protected $casts = [
        'dokumen' => 'array'
    ];

    public function lks() {
        return $this->belongsTo(Lks::class, 'lks_id');
    }
}

