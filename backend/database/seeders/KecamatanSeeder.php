<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kecamatan;

class KecamatanSeeder extends Seeder
{
    public function run(): void
    {
        $list = [
            'Indramayu', 'Lohbener', 'Sindang', 'Jatibarang', 'Kandanghaur',
            'Balongan', 'Losarang', 'Anjatan', 'Krangkeng', 'Lelea',
        ];

        foreach ($list as $nama) {
            Kecamatan::firstOrCreate(['nama' => $nama]);
        }

        $this->command->info('✅ KecamatanSeeder: 10 kecamatan berhasil dimasukkan.');
    }
}
