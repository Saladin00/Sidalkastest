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
        Schema::create('klien', function (Blueprint $table) {
            $table->id();

            // 🔹 Data identitas
            $table->string('nik', 20)->unique();
            $table->string('nama', 255);
            $table->text('alamat');

            // 🔹 Wilayah & relasi
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();

            // 🔹 Relasi ke tabel LKS (boleh kosong untuk admin/operator)
            $table->foreignId('lks_id')
                ->nullable() // ✅ ini penting untuk menghindari error 1364
                ->constrained('lks')
                ->onDelete('cascade');

            // 🔹 Informasi sosial
            $table->enum('jenis_kebutuhan', ['anak', 'disabilitas', 'lansia', 'fakir_miskin', 'lainnya'])->nullable();
            $table->enum('status_bantuan', ['BPNT', 'PKH', 'BLT', 'lainnya'])->nullable();
            $table->enum('status_pembinaan', ['aktif', 'selesai'])->default('aktif');

            // 🔹 Dokumen tambahan (bisa file JSON)
            $table->json('dokumen')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('klien');
    }
};
