<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // ✅ Tambahkan kolom relasi ke tabel kecamatan
            if (!Schema::hasColumn('users', 'kecamatan_id')) {
                $table->foreignId('kecamatan_id')
                    ->nullable()
                    ->after('status_aktif') // urutan di bawah status_aktif
                    ->constrained('kecamatan')
                    ->cascadeOnDelete();
            }

            // 🚫 Hapus kolom lama 'kecamatan' kalau masih ada (string)
            if (Schema::hasColumn('users', 'kecamatan')) {
                $table->dropColumn('kecamatan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 🔙 Balikkan perubahan kalau rollback
            if (!Schema::hasColumn('users', 'kecamatan')) {
                $table->string('kecamatan')->nullable();
            }

            if (Schema::hasColumn('users', 'kecamatan_id')) {
                $table->dropForeign(['kecamatan_id']);
                $table->dropColumn('kecamatan_id');
            }
        });
    }
};
