<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    protected $table = 'kecamatan';
    protected $fillable = ['nama'];

    // Relasi ke LKS
    public function lks()
    {
        return $this->hasMany(Lks::class, 'kecamatan_id', 'id');
    }

    // Relasi ke Klien
    public function klien()
    {
        return $this->hasMany(Klien::class, 'kecamatan_id', 'id');
    }

    // Relasi ke Users (operator / petugas)
    public function users()
    {
        return $this->hasMany(User::class, 'kecamatan_id', 'id');
    }
}
