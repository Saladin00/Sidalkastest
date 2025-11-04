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
            $table->string('kecamatan');
            $table->string('kelurahan')->nullable();
            $table->string('alamat')->nullable();
            $table->enum('status', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->string('legalitas')->nullable();
            $table->string('akta_pendirian')->nullable();
            $table->string('izin_operasional')->nullable();
            $table->string('no_akta')->nullable();
            $table->string('akreditasi')->nullable(); // alternatif jika kamu pakai "akreditasi" bukan "status_akreditasi"
            $table->string('status_akreditasi')->nullable(); // jika kamu ingin menyimpan A/B/C/Belum
            $table->string('no_sertifikat')->nullable();
            $table->date('tanggal_akreditasi')->nullable();
            $table->string('npwp')->nullable();
            $table->string('kontak_pengurus')->nullable();
            $table->integer('jumlah_pengurus')->nullable();
            $table->text('pengurus')->nullable(); // jika kamu isi detail pengurus
            $table->text('sarana')->nullable();
            $table->text('hasil_observasi')->nullable();
            $table->text('tindak_lanjut')->nullable();
            $table->string('koordinat')->nullable();
            $table->json('dokumen')->nullable(); // untuk file akta, izin, sertifikat

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
