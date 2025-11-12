<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Klien;
use App\Models\Lks;

class KlienSeeder extends Seeder
{
    public function run(): void
    {
        $jenisKebutuhan = ['Anak', 'Lansia', 'Disabilitas', 'fakir_miskin', 'lainnya'];
        $statusBantuan = ['PKH', 'BPNT', 'BLT', 'lainnya'];

        // ✅ Ambil hanya LKS yang punya kecamatan_id valid
        $lksList = Lks::whereNotNull('kecamatan_id')->with('kecamatan')->get();

        foreach ($lksList as $lks) {
            for ($i = 1; $i <= 10; $i++) {
                Klien::create([
                    'nik' => fake()->numerify('3209##########'),
                    'nama' => "Klien {$i} - {$lks->nama}",
                    'alamat' => "Jl. Melati No. {$i}, " . (optional($lks->kecamatan)->nama ?? 'Tidak diketahui'),
                    'kelurahan' => "Kelurahan {$i}",
                    'kecamatan_id' => $lks->kecamatan_id,
                    'lks_id' => $lks->id,
                    'jenis_kebutuhan' => $jenisKebutuhan[array_rand($jenisKebutuhan)],
                    'status_bantuan' => $statusBantuan[array_rand($statusBantuan)],
                    'status_pembinaan' => 'Aktif',
                ]);
            }
        }
    }
}
