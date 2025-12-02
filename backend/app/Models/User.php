<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles, CanResetPasswordTrait;

  protected $fillable = [
    'username',
    'name',
    'email',
    'password',
    'status_aktif',
    'kecamatan_id',
    'activation_code',
    'activation_token_expires_at',
    'lks_id',
];




    protected $hidden = [
        'password',
        'remember_token',
         // opsional kalau mau disembunyikan dari JSON API
    ];

    protected $casts = [
    'email_verified_at' => 'datetime',
    'status_aktif' => 'boolean',
    'activation_token_expires_at' => 'datetime',
];


    /* ----------------------------
     * 🔗 RELASI
     * ---------------------------- */

    // User punya satu LKS
    public function lks()
    {
        return $this->hasOne(Lks::class, 'user_id');
    }

    // User berada di satu kecamatan (opsional)
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id');
    }

    // Petugas bisa punya banyak verifikasi
    public function verifikasiDibuat()
    {
        return $this->hasMany(Verifikasi::class, 'petugas_id');
    }

    // Log verifikasi yang dibuat user
    public function verifikasiLogs()
    {
        return $this->hasMany(VerifikasiLog::class, 'user_id');
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

    public function isPetugas(): bool
    {
        return $this->hasRole('petugas');
    }

    public function isLks(): bool
    {
        return $this->hasRole('lks');
    }
}
