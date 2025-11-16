<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Klien;
use App\Models\Lks;

class KlienSeeder extends Seeder
{
    public function run()
    {
        $jenisKebutuhan = ['anak', 'disabilitas', 'lansia', 'fakir_miskin', 'lainnya'];
        $statusBantuan = ['PKH', 'BPNT', 'BLT', 'lainnya'];

        $lksList = Lks::all();

        foreach ($lksList as $lks) {
            for ($i = 1; $i <= 5; $i++) {

                Klien::create([
                    'nik' => fake()->numerify('3209##########'),
                    'nama' => "Klien {$i} - {$lks->nama}",
                    'alamat' => "Jl. Melati No. {$i}",
                    'kelurahan' => "Kelurahan {$i}",
                    'kecamatan_id' => $lks->kecamatan_id,
                    'lks_id' => $lks->id,
                    'jenis_kebutuhan' => $jenisKebutuhan[array_rand($jenisKebutuhan)],
                    'status_bantuan' => $statusBantuan[array_rand($statusBantuan)],
                    'status_pembinaan' => 'aktif',
                ]);
            }
        }
    }
}
