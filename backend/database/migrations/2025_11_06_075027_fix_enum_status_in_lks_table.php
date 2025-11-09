<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement("ALTER TABLE lks MODIFY COLUMN status ENUM('aktif','nonaktif','pending') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE lks MODIFY COLUMN status ENUM('Aktif','Nonaktif') DEFAULT 'Aktif'");
    }
};
