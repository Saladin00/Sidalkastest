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
        'legalitas',
        'akreditasi',
        'pengurus',
        'sarana',
        'kecamatan',
        'alamat',
        'koordinat',
        'status',
        'dokumen', // opsional, jika masih digunakan untuk path lama
    ];

    /**
     * Relasi ke tabel laporan_kunjungan
     * Setiap LKS bisa punya banyak laporan kunjungan.
     */
    public function kunjungan()
    {
        return $this->hasMany(LaporanKunjungan::class, 'lks_id');
    }

    /**
     * Relasi ke tabel dokumen_lks
     * Setiap LKS bisa memiliki banyak dokumen pendukung.
     */
    public function dokumen()
    {
        return $this->hasMany(DokumenLKS::class, 'lks_id');
    }
}
