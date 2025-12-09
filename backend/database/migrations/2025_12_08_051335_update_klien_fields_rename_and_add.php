<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('klien', function (Blueprint $table) {

            // Pastikan kolom jenis_bantuan ada terlebih dahulu
            if (!Schema::hasColumn('klien', 'jenis_bantuan')) {
                $table->string('jenis_bantuan')->nullable()->after('nama');
            }

            // Pastikan kolom kelompok_umur ada terlebih dahulu
            if (!Schema::hasColumn('klien', 'kelompok_umur')) {
                $table->string('kelompok_umur')->nullable()->after('jenis_bantuan');
            }

            // Tambah jenis_kelamin bila belum ada
            if (!Schema::hasColumn('klien', 'jenis_kelamin')) {
                $table->enum('jenis_kelamin', ['laki-laki', 'perempuan'])
                      ->nullable()->after('nama');
            }
        });

        // Setelah kolom ada → BARU boleh update isinya
        DB::table('klien')->update([
            'jenis_bantuan' => null,
            'kelompok_umur' => null,
        ]);

        // Lalu ubah enum-nya
        Schema::table('klien', function (Blueprint $table) {

            $table->enum('jenis_bantuan', ['BPNT', 'PKH', 'BLT', 'lainnya'])
                  ->nullable()->change();

            $table->enum('kelompok_umur', ['balita', 'anak', 'remaja', 'dewasa', 'lansia'])
                  ->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('klien', function (Blueprint $table) {

            if (Schema::hasColumn('klien', 'jenis_kelamin')) {
                $table->dropColumn('jenis_kelamin');
            }

            if (Schema::hasColumn('klien', 'jenis_bantuan')) {
                $table->enum('jenis_bantuan', ['anak', 'disabilitas', 'lansia', 'fakir_miskin', 'lainnya'])
                      ->nullable()->change();
            }

            if (Schema::hasColumn('klien', 'kelompok_umur')) {
                $table->enum('kelompok_umur', ['BPNT', 'PKH', 'BLT', 'lainnya'])
                      ->nullable()->change();
            }
        });
    }
};
