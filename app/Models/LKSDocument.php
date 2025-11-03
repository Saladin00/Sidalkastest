<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LKSDocument extends Model
{
    protected $table = 'lks_documents'; // ✅ tambahkan ini
    protected $fillable = ['lks_id', 'nama', 'file'];

    public function lks()
    {
        return $this->belongsTo(LKS::class, 'lks_id');
    }
}


