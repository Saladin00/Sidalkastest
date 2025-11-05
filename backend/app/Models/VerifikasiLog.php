<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerifikasiLog extends Model
{
    protected $table = 'verifikasi_logs';

    protected $fillable = [
        'verifikasi_id',
        'user_id',
        'aksi',
        'keterangan',
    ];

    public function verifikasi()
    {
        return $this->belongsTo(Verifikasi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
