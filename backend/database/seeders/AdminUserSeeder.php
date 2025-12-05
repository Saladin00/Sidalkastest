<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'username' => 'admin_dinsos',
                'name' => 'Admin Dinsos',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('admin123'),
                'status_aktif' => true,
            ]
        );

        $admin->assignRole('admin');
    }
}
