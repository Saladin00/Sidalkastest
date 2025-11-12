<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            // 1️⃣ Tambah kolom baru kecamatan_id
            if (!Schema::hasColumn('lks', 'kecamatan_id')) {
                $table->foreignId('kecamatan_id')
                    ->nullable()
                    ->after('sarana')
                    ->constrained('kecamatan')
                    ->cascadeOnDelete();
            }
        });

        // 2️⃣ Pindahkan data lama dari kolom `kecamatan` ke `kecamatan_id` jika cocok
        if (Schema::hasColumn('lks', 'kecamatan')) {
            $rows = DB::table('lks')->select('id', 'kecamatan')->get();
            foreach ($rows as $row) {
                $kec = DB::table('kecamatan')
                    ->where('nama', $row->kecamatan)
                    ->first();
                if ($kec) {
                    DB::table('lks')
                        ->where('id', $row->id)
                        ->update(['kecamatan_id' => $kec->id]);
                }
            }
        }

        // 3️⃣ Hapus kolom lama
        Schema::table('lks', function (Blueprint $table) {
            if (Schema::hasColumn('lks', 'kecamatan')) {
                $table->dropColumn('kecamatan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            // Balikkan ke kolom string lama
            if (!Schema::hasColumn('lks', 'kecamatan')) {
                $table->string('kecamatan')->nullable()->after('sarana');
            }

            if (Schema::hasColumn('lks', 'kecamatan_id')) {
                $table->dropForeign(['kecamatan_id']);
                $table->dropColumn('kecamatan_id');
            }
        });
    }
};
