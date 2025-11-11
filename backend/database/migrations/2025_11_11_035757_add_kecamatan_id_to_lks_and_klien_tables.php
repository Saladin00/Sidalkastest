<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            $table->foreignId('kecamatan_id')->nullable()->constrained('kecamatan')->cascadeOnDelete();
        });

        Schema::table('klien', function (Blueprint $table) {
            $table->foreignId('kecamatan_id')->nullable()->constrained('kecamatan')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kecamatan_id');
        });

        Schema::table('klien', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kecamatan_id');
        });
    }
};
