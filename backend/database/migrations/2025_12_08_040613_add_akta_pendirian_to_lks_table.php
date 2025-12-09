<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            // Tambahkan kolom file akta pendirian jika belum ada
            if (!Schema::hasColumn('lks', 'akta_pendirian')) {
                $table->string('akta_pendirian')->nullable()->after('legalitas');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            if (Schema::hasColumn('lks', 'akta_pendirian')) {
                $table->dropColumn('akta_pendirian');
            }
        });
    }
};
