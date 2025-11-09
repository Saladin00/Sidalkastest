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
        Schema::table('lks', function (Blueprint $table) {
            // Hanya tambahkan kolom baru yang belum ada
            $table->string('no_akta')->nullable();
            $table->string('izin_operasional')->nullable();
            $table->string('akta_pendirian')->nullable();
            $table->string('status_akreditasi')->nullable();
            $table->string('no_sertifikat')->nullable();
            $table->date('tanggal_akreditasi')->nullable();
            $table->string('npwp')->nullable();
            $table->string('kontak_pengurus')->nullable();
            $table->integer('jumlah_pengurus')->nullable();
            $table->text('hasil_observasi')->nullable();
            $table->text('tindak_lanjut')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            // Hapus kolom yang ditambahkan jika rollback
            $table->dropColumn([
                'no_akta',
                'izin_operasional',
                'akta_pendirian',
                'status_akreditasi',
                'no_sertifikat',
                'tanggal_akreditasi',
                'npwp',
                'kontak_pengurus',
                'jumlah_pengurus',
                'hasil_observasi',
                'tindak_lanjut',
            ]);
        });
    }
};
