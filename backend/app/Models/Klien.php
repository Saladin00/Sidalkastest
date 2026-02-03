<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Klien extends Model
{
    protected $table = 'klien';

protected $fillable = [
    'nik',
    'nama',
    'jenis_kelamin',
    'alamat',
    'kelurahan',
    'kecamatan_id',
    'lks_id',
    'jenis_bantuan',
    'kelompok_umur',
    'status_pembinaan',
    
];

    protected $casts = [
        'dokumen' => 'array'
    ];

    // 🔗 Relasi ke LKS
    public function lks()
    {
        return $this->belongsTo(Lks::class, 'lks_id', 'id');
    }

    // 🔗 Relasi ke Kecamatan
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id', );
    }
}
