<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Lks;
use App\Models\User;
use App\Models\Kecamatan;
use App\Models\Verifikasi;

class LksSeeder extends Seeder
{
    public function run(): void
    {
        $kecamatanList = Kecamatan::take(5)->get();
        $jenisList = ['Anak', 'Lansia', 'Disabilitas', 'Fakir Miskin', 'Kesejahteraan Sosial'];

        foreach ($kecamatanList as $kec) {
            for ($i = 1; $i <= 10; $i++) {
                $username = strtolower($kec->nama) . "_lks{$i}";
                $email = "{$username}@example.com";

                // 👤 Buat user LKS
                $user = User::firstOrCreate(
                    ['username' => $username],
                    [
                        'name' => "LKS {$i} {$kec->nama}",
                        'email' => $email,
                        'password' => Hash::make('password'),
                        'status_aktif' => true,
                    ]
                );
                $user->assignRole('lks');

                // 🏢 Buat data LKS
                $lks = Lks::create([
                    'nama' => "LKS {$i} {$kec->nama}",
                    'jenis_layanan' => $jenisList[array_rand($jenisList)],
                    'status' => 'Aktif',
                    'alamat' => "Jl. Mawar No.{$i}, {$kec->nama}",
                    'kelurahan' => "Kelurahan {$i}",
                    'kecamatan_id' => $kec->id,
                    'npwp' => fake()->numerify('##.###.###.#-###.###'),
                    'kontak_pengurus' => fake()->phoneNumber(),
                    'koordinat' => '-6.33,108.32',
                ]);

                // 🔗 Hubungkan user → LKS
                $user->update(['lks_id' => $lks->id]);

                // 🧾 Buat verifikasi awal otomatis
                Verifikasi::create([
                    'lks_id' => $lks->id,
                    'petugas_id' => $user->id,
                    'status' => 'menunggu',
                    'penilaian' => 'Menunggu verifikasi awal',
                    'catatan' => 'Seeder otomatis',
                    'tanggal_verifikasi' => now(),
                ]);
            }
        }

        $this->command->info('✅ 50 LKS berhasil dibuat beserta akun dan verifikasinya.');
    }
}
