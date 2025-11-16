<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        $roles = ['admin', 'operator', 'petugas', 'lks'];

        $permissions = [
            'manage users',
            'manage lks',
            'manage clients',
            'verify data',
            'view reports',
            'upload documents',
            'submit complaints',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            if ($roleName === 'admin') {
                $role->syncPermissions(Permission::all());
            }
        }
    }
}
