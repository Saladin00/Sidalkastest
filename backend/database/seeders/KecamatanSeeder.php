<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kecamatan;

class KecamatanSeeder extends Seeder
{
    public function run()
    {
        $kecamatanList = [
            'Indramayu', 'Lohbener', 'Sindang', 'Jatibarang', 'Kandanghaur',
            'Balongan', 'Losarang', 'Anjatan', 'Krangkeng', 'Lelea',
            'Sukagumiwang', 'Gabuswetan', 'Sliyeg', 'Juntinyuat', 'Kroya',
            'Widasari', 'Cantigi', 'Bongas', 'Gantar', 'Haurgeulis',
            'Terisi', 'Bangodua', 'Karangampel', 'Kedokan Bunder',
            'Pasekan', 'Patrol'
        ];

        foreach ($kecamatanList as $nama) {
            Kecamatan::firstOrCreate(['nama' => $nama]);
        }
    }
}
