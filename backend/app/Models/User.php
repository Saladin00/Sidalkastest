<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $fillable = [
    'username',
    'name',
    'email',
    'password',
    'status_aktif',
    'kecamatan_id', // ✅ tambahkan ini
];


    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'status_aktif' => 'boolean',
    ];

    /* ----------------------------
     * 🔗 RELASI
     * ---------------------------- */

    // Relasi ke LKS (satu user punya satu LKS)
    public function lks()
{
    return $this->hasOne(\App\Models\Lks::class, 'user_id');
}


    /* ----------------------------
     * 🧩 HELPER METHODS
     * ---------------------------- */

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isOperator(): bool
    {
        return $this->hasRole('operator');
    }

    public function isLks(): bool
    {
        return $this->hasRole('lks');
    }
    
    public function kecamatan()
{
    return $this->belongsTo(Kecamatan::class);
}

}


