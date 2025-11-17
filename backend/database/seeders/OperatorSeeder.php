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
        $targetKecamatan = ['Indramayu', 'Lohbener', 'Sindang', 'Jatibarang', 'Kandanghaur'];

        $kecamatanList = Kecamatan::whereIn('nama', $targetKecamatan)->get();

        foreach ($kecamatanList as $kec) {
            $user = User::firstOrCreate(
                ['email' => strtolower($kec->nama).'_operator@sidalekas.go.id'],
                [
                    'username' => strtolower($kec->nama).'_operator',
                    'name' => "Operator {$kec->nama}",
                    'password' => Hash::make('operator123'),
                    'kecamatan_id' => $kec->id,
                    'status_aktif' => true,
                ]
            );

            $user->assignRole('operator');
        }
    }
}
