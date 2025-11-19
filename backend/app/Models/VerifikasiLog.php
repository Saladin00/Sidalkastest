<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerifikasiLog extends Model
{
    use HasFactory;

    protected $table = 'verifikasi_logs';

    protected $fillable = [
        'verifikasi_id',
        'user_id',
        'aksi',
        'keterangan',
    ];

    /* ----------------------------
     * 🔗 RELASI
     * ---------------------------- */

    // Log ini milik satu verifikasi
    public function verifikasi()
    {
        return $this->belongsTo(Verifikasi::class, 'verifikasi_id');
    }

    // Log ini dibuat oleh satu user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
