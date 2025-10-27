<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            'Admin Dinsos',
            'Operator Kecamatan',
            'Petugas Lapangan',
            'LKS'
        ];

        $permissions = [
            'manage users',
            'manage lks',
            'manage clients',
            'verify data',
            'view reports',
            'upload documents',
            'submit complaints'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            if ($roleName === 'Admin Dinsos') {
                $role->syncPermissions(Permission::all());
            }
        }
    }
}
