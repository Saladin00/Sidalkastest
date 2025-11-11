<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public function verifikasi()
    {
        return $this->belongsTo(Verifikasi::class, 'verifikasi_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,  'user_id');
    }
}
