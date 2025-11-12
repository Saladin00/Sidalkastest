<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Kecamatan;

class OperatorSeeder extends Seeder
{
    public function run(): void
    {
        $kecamatanList = Kecamatan::take(5)->get(); // hanya 5 aktif

        foreach ($kecamatanList as $kec) {
            $username = strtolower($kec->nama) . '_operator';
            $email = strtolower($kec->nama) . '_operator@example.com';

            $operator = User::firstOrCreate(
                ['username' => $username],
                [
                    'name' => "Operator {$kec->nama}",
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'status_aktif' => true,
                    'kecamatan' => $kec->nama,
                ]
            );

            $operator->assignRole('operator');
        }

        $this->command->info('✅ 5 Operator berhasil dibuat dan diberikan role.');
    }
}
