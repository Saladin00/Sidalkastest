<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1️⃣ Pastikan kolom ada terlebih dahulu
        Schema::table('klien', function (Blueprint $table) {

            // jenis_bantuan
            if (!Schema::hasColumn('klien', 'jenis_bantuan')) {
                $table->string('jenis_bantuan')->nullable()->after('nama');
            }

            // kelompok_umur
            if (!Schema::hasColumn('klien', 'kelompok_umur')) {
                $table->string('kelompok_umur')->nullable()->after('jenis_bantuan');
            }

            // jenis_kelamin
            if (!Schema::hasColumn('klien', 'jenis_kelamin')) {
                $table->enum('jenis_kelamin', ['laki-laki', 'perempuan'])
                    ->nullable()
                    ->after('nama');
            }
        });

        // 2️⃣ NULL-kan value lama → supaya enum baru tidak error
        DB::table('klien')->update([
            'jenis_bantuan' => null,
            'kelompok_umur' => null,
        ]);

        // 3️⃣ Update ENUM terbaru
        Schema::table('klien', function (Blueprint $table) {

            if (Schema::hasColumn('klien', 'jenis_bantuan')) {
                $table->enum('jenis_bantuan', ['BPNT', 'PKH', 'BLT', 'lainnya'])
                    ->nullable()
                    ->change();
            }

            if (Schema::hasColumn('klien', 'kelompok_umur')) {
                $table->enum('kelompok_umur', ['balita', 'anak', 'remaja', 'dewasa', 'lansia'])
                    ->nullable()
                    ->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('klien', function (Blueprint $table) {

            // Hapus jenis_kelamin
            if (Schema::hasColumn('klien', 'jenis_kelamin')) {
                $table->dropColumn('jenis_kelamin');
            }

            // Kembalikan enum jenis_bantuan ke versi lama
            if (Schema::hasColumn('klien', 'jenis_bantuan')) {
                $table->enum('jenis_bantuan', ['anak', 'disabilitas', 'lansia', 'fakir_miskin', 'lainnya'])
                    ->nullable()
                    ->change();
            }

            // Kembalikan enum kelompok_umur ke versi lama (sebelumnya tertukar)
            if (Schema::hasColumn('klien', 'kelompok_umur')) {
                $table->enum('kelompok_umur', ['BPNT', 'PKH', 'BLT', 'lainnya'])
                    ->nullable()
                    ->change();
            }
        });
    }
};
