<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Kecamatan;

class PetugasSeeder extends Seeder
{
    public function run(): void
    {
        $kecamatan = Kecamatan::whereIn('nama', [
            'Indramayu','Sindang','Lohbener','Jatibarang','Kandanghaur','Balongan'
        ])->get();

        foreach ($kecamatan as $kec) {
            $slug = Str::slug($kec->nama, '_');

            for ($i = 1; $i <= 3; $i++) {
                $user = User::firstOrCreate(
                    ['email' => "petugas{$i}.{$slug}@gmail.com"], // ✅ Gmail
                    [
                        'username'     => "petugas{$i}_{$slug}",
                        'name'         => "Petugas {$i} {$kec->nama}",
                        'password'     => Hash::make('password'), // ✅ "password"
                        'kecamatan_id' => $kec->id,
                        'status_aktif' => true,
                    ]
                );

                if (!$user->hasRole('petugas')) {
                    $user->assignRole('petugas');
                }
            }
        }
    }
}
