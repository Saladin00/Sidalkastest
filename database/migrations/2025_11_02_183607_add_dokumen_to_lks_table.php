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
        Schema::table('l_k_s', function (Blueprint $table) {
            // 🆕 Tambahkan kolom dokumen bertipe JSON setelah kolom status
            $table->json('dokumen')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('l_k_s', function (Blueprint $table) {
            // 🔙 Hapus kolom dokumen jika rollback
            $table->dropColumn('dokumen');
        });
    }
};
