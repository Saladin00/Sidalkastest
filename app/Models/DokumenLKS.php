<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenLKS extends Model
{
    protected $table = 'dokumen_lks'; // sesuai migration

    protected $fillable = ['lks_id', 'nama', 'path'];

    public function lks()
    {
        return $this->belongsTo(LKS::class, 'lks_id');
    }
}
