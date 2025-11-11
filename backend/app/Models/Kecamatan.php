<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    protected $table = 'kecamatan';
    protected $fillable = ['nama'];

    public function lks()
    {
        return $this->hasMany(Lks::class, 'kecamatan', 'nama');
    }


public function klien()
{
    return $this->hasMany(Klien::class, 'kecamatan_id');
}

}