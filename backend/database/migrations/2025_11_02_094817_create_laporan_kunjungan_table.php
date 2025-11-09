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
        Schema::create('laporan_kunjungan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lks_id')
                  ->constrained('lks')
                  ->onDelete('cascade'); // otomatis hapus laporan jika LKS dihapus
            $table->string('petugas'); // nama petugas yang melakukan kunjungan
            $table->text('catatan');   // catatan hasil kunjungan
            $table->date('tanggal');   // tanggal kunjungan
            $table->timestamps();      // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_kunjungan');
    }
};
