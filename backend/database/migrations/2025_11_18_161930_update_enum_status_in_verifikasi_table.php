<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement("
            ALTER TABLE verifikasi 
            MODIFY COLUMN status 
            ENUM('menunggu', 'dikirim_operator', 'proses_survei', 'valid', 'tidak_valid') 
            DEFAULT 'menunggu'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE verifikasi 
            MODIFY COLUMN status 
            ENUM('menunggu', 'valid', 'tidak_valid') 
            DEFAULT 'menunggu'
        ");
    }
};
