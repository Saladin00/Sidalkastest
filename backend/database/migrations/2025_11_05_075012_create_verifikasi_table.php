<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('verifikasi', function (Blueprint $t) {
            $t->id();

            // FK ke tabel LKS kamu: 'l_k_s'
            $t->foreignId('lks_id')->constrained('lks')->cascadeOnDelete();

            // siapkan kolom klien kalau nanti dipakai
            $t->unsignedBigInteger('klien_id')->nullable();

            // petugas yang mengisi verifikasi (users)
            $t->foreignId('petugas_id')->constrained('users')->cascadeOnDelete();

            $t->enum('status', ['menunggu','valid','tidak_valid'])->default('menunggu');
            $t->text('penilaian')->nullable();
            $t->text('catatan')->nullable();
            $t->json('foto_bukti')->nullable();   // array path foto
            $t->dateTime('tanggal_verifikasi')->nullable();

            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verifikasi');
    }
};
