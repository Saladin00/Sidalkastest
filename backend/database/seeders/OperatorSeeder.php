<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Kecamatan;

class OperatorSeeder extends Seeder
{
    public function run(): void
    {
        $kecamatan = Kecamatan::whereIn('nama', [
            'Indramayu','Sindang','Lohbener','Jatibarang','Kandanghaur','Balongan'
        ])->get();

        foreach ($kecamatan as $kec) {
            $slug = Str::slug($kec->nama, '_');

            $user = User::firstOrCreate(
                ['email' => "operator.{$slug}@gmail.com"], // ✅ Gmail
                [
                    'username'     => "operator_{$slug}",
                    'name'         => "Operator {$kec->nama}",
                    'password'     => Hash::make('password'), // ✅ "password"
                    'kecamatan_id' => $kec->id,
                    'status_aktif' => true,
                ]
            );

            if (!$user->hasRole('operator')) {
                $user->assignRole('operator');
            }
        }
    }
}
