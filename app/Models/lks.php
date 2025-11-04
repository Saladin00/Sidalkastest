<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LKS extends Model
{
    use HasFactory;

    protected $table = 'l_k_s';

    protected $fillable = [
        'nama',
        'jenis_layanan',
        'status',
        'alamat',
        'kelurahan',
        'kecamatan',
        'npwp',
        'kontak_pengurus',
        'akta_pendirian',
        'izin_operasional',
        'legalitas',
        'no_akta',
        'status_akreditasi',
        'no_sertifikat',
        'tanggal_akreditasi',
        'koordinat',
        'jumlah_pengurus',
        'sarana',
        'hasil_observasi',
        'tindak_lanjut',
        'dokumen',
    ];

    public function kunjungan()
    {
        return $this->hasMany(LaporanKunjungan::class, 'lks_id');
    }
}
