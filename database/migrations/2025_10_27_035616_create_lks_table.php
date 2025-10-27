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
        Schema::create('lks', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('jenis');
            $table->text('alamat');
            $table->string('desa');
            $table->string('kecamatan');
            $table->string('no izin operasional');
            $table->string('tanggal izin');
            $table->string('status akreditasi');
            $table->string('jumlah pengurus');
            $table->string('kapasitas');
            $table->string('status aktif');
            $table->string('kordinta_lat');
            $table->string('kordinat_lng');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lks');
    }
};
