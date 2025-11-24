<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('lks', function (Blueprint $table) {
        $table->enum('status_verifikasi', [
            'belum_verifikasi',
            'menunggu_operator',
            'proses_survei',
            'proses_validasi',
            'valid',
            'tidak_valid'
        ])->default('belum_verifikasi')->after('status');
    });
}

public function down(): void
{
    Schema::table('lks', function (Blueprint $table) {
        $table->dropColumn('status_verifikasi');
    });
}
};
