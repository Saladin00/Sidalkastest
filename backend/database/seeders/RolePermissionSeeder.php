<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Gunakan slug nama yang sama dengan frontend
        $roles = [
            'admin'    => 'Admin Dinsos',
            'operator' => 'Operator Kecamatan',
            'petugas'  => 'Petugas Lapangan',
            'lks'      => 'Lembaga Kesejahteraan Sosial',
        ];

        $permissions = [
            'manage users',
            'manage lks',
            'manage clients',
            'verify data',
            'view reports',
            'upload documents',
            'submit complaints',
        ];

        // Buat permission dengan guard web
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Buat role dan assign permission
       foreach ($roles as $slug => $displayName) {
    $role = Role::firstOrCreate([
        'name' => $slug,
        'guard_name' => 'web',
    ]);

    // Admin dapat semua permission
    if ($slug === 'admin') {
        $role->syncPermissions(Permission::all());
    }
}

    }
}
