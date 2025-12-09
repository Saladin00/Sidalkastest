<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1️⃣ NULL-kan value lama agar ENUM tidak error
        DB::table('klien')->update([
            'jenis_bantuan' => null,
            'kelompok_umur' => null,
        ]);

        // 2️⃣ Perbaiki enum sesuai kebutuhan baru
        Schema::table('klien', function (Blueprint $table) {

            // jenis_bantuan → enum baru
            if (Schema::hasColumn('klien', 'jenis_bantuan')) {
                $table->enum('jenis_bantuan', ['BPNT', 'PKH', 'BLT', 'lainnya'])
                    ->nullable()
                    ->change();
            }

            // kelompok_umur → enum kelompok umur
            if (Schema::hasColumn('klien', 'kelompok_umur')) {
                $table->enum('kelompok_umur', ['balita', 'anak', 'remaja', 'dewasa', 'lansia'])
                    ->nullable()
                    ->change();
            }

            // Tambahkan jenis_kelamin
            if (!Schema::hasColumn('klien', 'jenis_kelamin')) {
                $table->enum('jenis_kelamin', ['laki-laki', 'perempuan'])
                    ->nullable()
                    ->after('nama');
            }
        });
    }

    public function down(): void
    {
        Schema::table('klien', function (Blueprint $table) {

            if (Schema::hasColumn('klien', 'jenis_kelamin')) {
                $table->dropColumn('jenis_kelamin');
            }

            if (Schema::hasColumn('klien', 'jenis_bantuan')) {
                $table->enum('jenis_bantuan', ['anak','disabilitas','lansia','fakir_miskin','lainnya'])
                    ->nullable()
                    ->change();
            }

            if (Schema::hasColumn('klien', 'kelompok_umur')) {
                $table->enum('kelompok_umur', ['BPNT','PKH','BLT','lainnya'])
                    ->nullable()
                    ->change();
            }
        });
    }
};
