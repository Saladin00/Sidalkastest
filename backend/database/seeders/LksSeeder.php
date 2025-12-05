<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Lks;
use App\Models\Kecamatan;
use App\Models\Verifikasi;

class LksSeeder extends Seeder
{
    public function run(): void
    {
        /* ================================
         * RESET DATA
         * ================================ */
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('verifikasi_logs')->truncate();
        DB::table('verifikasi')->truncate();
        DB::table('klien')->truncate();
        DB::table('lks')->truncate();

        // Hapus semua user role LKS
        User::role('lks')->get()->each(fn($u) => $u->delete());

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        /* ================================
         * DATA DESA PER KECAMATAN
         * ================================ */
    }
}
