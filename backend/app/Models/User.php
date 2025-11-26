<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

use Illuminate\Contracts\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles,  CanResetPasswordTrait;

    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'status_aktif',
        'kecamatan_id',
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

    // Satu user bisa memiliki satu LKS
    public function lks()
    {
        return $this->hasOne(Lks::class, 'user_id');
    }

    // Setiap user (operator/petugas/lks) berada di satu kecamatan
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id');
    }

    // Petugas bisa memiliki banyak verifikasi
    public function verifikasiDibuat()
    {
        return $this->hasMany(Verifikasi::class, 'petugas_id');
    }

    // Semua aktivitas log verifikasi yang dibuat user ini
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
