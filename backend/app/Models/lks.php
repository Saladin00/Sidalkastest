<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lks extends Model
{
    use HasFactory;

    protected $table = 'lks';

    protected $fillable = [
        'nama',
        'jenis_layanan',
        'status',
        'alamat',
        'kelurahan',
        'kecamatan_id',
        'npwp',
        'kontak_pengurus',
        'akta_pendirian',
        'izin_operasional',
        'legalitas',
        'no_akta',
        'status_akreditasi',
        'no_sertifikat',
        'tanggal_akreditasi',
        'status_verifikasi',
        'koordinat',
        'jumlah_pengurus',
        'sarana',
        'hasil_observasi',
        'tindak_lanjut',
        'dokumen',
        'user_id',
    ];

    protected $casts = [
        'dokumen' => 'array',
        'tanggal_akreditasi' => 'date',
        'status_verifikasi' => 'string',
        'akta_pendirian' => 'string',
    ];
    

    /* ----------------------------
     * 🔗 RELASI
     * ---------------------------- */

    // 1️⃣ LKS dimiliki oleh satu user (akun LKS)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // 2️⃣ LKS berada di satu kecamatan
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id');
    }

    // 3️⃣ LKS memiliki banyak klien
    public function klien()
    {
        return $this->hasMany(Klien::class, 'lks_id');
    }

    // 4️⃣ LKS memiliki banyak laporan kunjungan
    public function kunjungan()
    {
        return $this->hasMany(LaporanKunjungan::class, 'lks_id');
    }

    // 5️⃣ LKS memiliki banyak data verifikasi
    public function verifikasi()
    {
        return $this->hasMany(Verifikasi::class, 'lks_id');
    }

    // 6️⃣ Verifikasi terbaru (relasi satu-satu dengan verifikasi terakhir)
    public function verifikasiTerbaru()
    {
        return $this->hasOne(Verifikasi::class, 'lks_id')->latestOfMany();
    }
}
