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
        $kecamatanList = Kecamatan::whereIn('nama', [
            'Indramayu', 'Lohbener', 'Sindang', 'Jatibarang', 'Kandanghaur'
        ])->get();

        $jenisList = ['Anak', 'Lansia', 'Disabilitas', 'Fakir Miskin', 'Kesejahteraan Sosial'];

        foreach ($kecamatanList as $kec) {
            for ($i = 1; $i <= 5; $i++) {

                $username = strtolower($kec->nama)."_lks{$i}";
                $email = "{$username}@example.com";

                // USER LKS
                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'username' => $username,
                        'name' => "LKS {$i} {$kec->nama}",
                        'password' => Hash::make('password'),
                        'status_aktif' => true,
                        'kecamatan_id' => $kec->id,
                    ]
                );

                $user->assignRole('lks');

                // LKS DATA
                $lks = Lks::create([
                    'nama' => "LKS {$i} {$kec->nama}",
                    'jenis_layanan' => $jenisList[array_rand($jenisList)],
                    'status' => 'aktif',
                    'alamat' => "Jl. Mawar {$i}, {$kec->nama}",
                    'kelurahan' => "Kelurahan {$i}",
                    'kecamatan_id' => $kec->id,
                    'npwp' => fake()->numerify('##.###.###.#-###.###'),
                    'kontak_pengurus' => fake()->phoneNumber(),
                    'koordinat' => '-6.33,108.32',
                ]);

                // Hubungkan user dengan LKS
                $user->update(['lks_id' => $lks->id]);
            }
        }
    }
}
