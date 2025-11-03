<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration.
     */
    public function up(): void
    {
        Schema::create('dokumen_lks', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel LKS
            $table->foreignId('lks_id')
                  ->constrained('l_k_s')
                  ->onDelete('cascade');

            // Kolom utama
            $table->string('nama'); // Nama file (misal: "Akta Pendirian", "SK Kemenkumham")
            $table->string('path'); // Lokasi file di storage/public/dokumen_lks

            $table->timestamps();
        });
    }

    /**
     * Batalkan migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_lks');
    }
};
