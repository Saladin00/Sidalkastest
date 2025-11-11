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
        'status', // aktif / pending / ditolak
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
        'koordinat',
        'jumlah_pengurus',
        'sarana',
        'hasil_observasi',
        'tindak_lanjut',
        'dokumen',
    ];

    protected $casts = [
        'dokumen' => 'array',
        'tanggal_akreditasi' => 'date',
    ];

    /* ----------------------------
     * 🔗 RELASI
     * ---------------------------- */

    /**
     * 🧍 1️⃣ Satu LKS dimiliki oleh satu user (akun LKS)
     */
    public function user()
    {
        return $this->hasOne(User::class, 'lks_id', 'id');
    }

    /**
     * 👥 2️⃣ LKS memiliki banyak klien
     */
    public function klien()
    {
        return $this->hasMany(Klien::class, 'lks_id', 'id');
    }

    /**
     * 🏙️ 3️⃣ LKS berada di satu kecamatan
     */
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id', 'id');
    }

    /**
     * 🧾 4️⃣ LKS memiliki banyak laporan kunjungan
     */
    public function kunjungan()
    {
        return $this->hasMany(LaporanKunjungan::class, 'lks_id', 'id');
    }

    /**
     * 📋 5️⃣ Relasi ke semua data verifikasi
     */
    public function verifikasi()
    {
        return $this->hasMany(\App\Models\Verifikasi::class, 'lks_id', 'id');
    }

    /**
     * ✅ 6️⃣ Relasi ke verifikasi terbaru
     * Mengambil data verifikasi terakhir berdasarkan kolom ID.
     */
    public function verifikasiTerbaru()
    {
        return $this->hasOne(\App\Models\Verifikasi::class, 'lks_id', )
                    ->latestOfMany(); // lebih rapi dari manual latest('id')
    }
}
