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
        Schema::create('l_k_s', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('jenis_layanan');
            $table->string('legalitas')->nullable();
            $table->string('akreditasi')->nullable();
            $table->text('pengurus')->nullable();
            $table->text('sarana')->nullable();
            $table->string('kecamatan');
            $table->string('alamat')->nullable();
            $table->string('koordinat')->nullable();
            $table->enum('status', ['Aktif', 'Nonaktif'])->default('Aktif');

            // ✅ Simpan banyak file (akta, izin, sertifikat) sebagai JSON
            $table->json('dokumen')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('l_k_s');
    }
};
