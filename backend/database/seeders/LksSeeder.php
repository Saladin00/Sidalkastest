<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Lks;
use App\Models\User;
use App\Models\Kecamatan;

class LksSeeder extends Seeder
{
    public function run()
    {
        $targetKecamatan = ['Indramayu', 'Lohbener', 'Sindang', 'Jatibarang', 'Kandanghaur'];

        $kecamatanList = Kecamatan::whereIn('nama', $targetKecamatan)->get();

        $jenisList = ['Anak', 'Lansia', 'Disabilitas', 'Fakir Miskin', 'Kesejahteraan Sosial'];

        foreach ($kecamatanList as $kec) {
            for ($i = 1; $i <= 5; $i++) {

                $username = strtolower($kec->nama)."_lks{$i}";
                $email = "{$username}@sidalekas.go.id";

                // USER LKS
                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'username' => $username,
                        'name' => "LKS {$i} {$kec->nama}",
                        'password' => Hash::make('lks123'),
                        'status_aktif' => true,
                        'kecamatan_id' => $kec->id,
                    ]
                );

                $user->assignRole('lks');

                // DATA LKS
                $lks = Lks::firstOrCreate(
                    [
                        'nama' => "LKS {$i} {$kec->nama}",
                        'kecamatan_id' => $kec->id,
                    ],
                    [
                        'jenis_layanan' => $jenisList[array_rand($jenisList)],
                        'status' => 'aktif',
                        'alamat' => "Jl. Mawar {$i}, {$kec->nama}",
                        'kelurahan' => "Kelurahan {$i}",
                        'npwp' => fake()->numerify('##.###.###.#-###.###'),
                        'kontak_pengurus' => fake()->phoneNumber(),
                        'koordinat' => '-6.33,108.32',
                    ]
                );

                // Hubungkan user dengan LKS
                $user->update(['lks_id' => $lks->id]);
            }
        }
    }
}
