<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Kecamatan;

class OperatorSeeder extends Seeder
{
    public function run()
    {
        $kecamatanList = Kecamatan::whereIn('nama', [
            'Indramayu', 'Lohbener', 'Sindang', 'Jatibarang', 'Kandanghaur'
        ])->get();

        foreach ($kecamatanList as $kec) {
            $user = User::firstOrCreate(
                ['email' => strtolower($kec->nama).'_operator@example.com'],
                [
                    'username' => strtolower($kec->nama).'_operator',
                    'name' => "Operator {$kec->nama}",
                    'password' => Hash::make('password'),
                    'kecamatan_id' => $kec->id,
                    'status_aktif' => true,
                ]
            );

            $user->assignRole('operator');
        }
    }
}
