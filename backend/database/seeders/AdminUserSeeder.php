<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@sidalekas.go.id'],
            [
                'username' => 'admin dinsos',
                'name' => 'Admin Dinsos',
                'email' => 'admin@sidalekas.go.id',
                'password' => bcrypt('admin123'),
                'status_aktif' => true,
            ]
        );

        $admin->assignRole('Admin Dinsos');
    }
}
