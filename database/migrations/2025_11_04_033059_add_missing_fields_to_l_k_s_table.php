<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('l_k_s', function (Blueprint $table) {
            // Tambahkan kolom hanya jika belum ada (aman untuk database lama)
            if (!Schema::hasColumn('l_k_s', 'kelurahan')) {
                $table->string('kelurahan')->nullable()->after('kecamatan');
            }
            if (!Schema::hasColumn('l_k_s', 'npwp')) {
                $table->string('npwp')->nullable()->after('kelurahan');
            }
            if (!Schema::hasColumn('l_k_s', 'kontak_pengurus')) {
                $table->string('kontak_pengurus')->nullable()->after('npwp');
            }
            if (!Schema::hasColumn('l_k_s', 'akta_pendirian')) {
                $table->string('akta_pendirian')->nullable()->after('kontak_pengurus');
            }
            if (!Schema::hasColumn('l_k_s', 'izin_operasional')) {
                $table->string('izin_operasional')->nullable()->after('akta_pendirian');
            }
            if (!Schema::hasColumn('l_k_s', 'legalitas')) {
                $table->string('legalitas')->nullable()->after('izin_operasional');
            }
            if (!Schema::hasColumn('l_k_s', 'no_akta')) {
                $table->string('no_akta')->nullable()->after('legalitas');
            }
            if (!Schema::hasColumn('l_k_s', 'status_akreditasi')) {
                $table->string('status_akreditasi')->nullable()->after('no_akta');
            }
            if (!Schema::hasColumn('l_k_s', 'no_sertifikat')) {
                $table->string('no_sertifikat')->nullable()->after('status_akreditasi');
            }
            if (!Schema::hasColumn('l_k_s', 'tanggal_akreditasi')) {
                $table->date('tanggal_akreditasi')->nullable()->after('no_sertifikat');
            }
            if (!Schema::hasColumn('l_k_s', 'koordinat')) {
                $table->string('koordinat')->nullable()->after('tanggal_akreditasi');
            }
            if (!Schema::hasColumn('l_k_s', 'jumlah_pengurus')) {
                $table->integer('jumlah_pengurus')->nullable()->after('koordinat');
            }
            if (!Schema::hasColumn('l_k_s', 'sarana')) {
                $table->text('sarana')->nullable()->after('jumlah_pengurus');
            }
            if (!Schema::hasColumn('l_k_s', 'hasil_observasi')) {
                $table->text('hasil_observasi')->nullable()->after('sarana');
            }
            if (!Schema::hasColumn('l_k_s', 'tindak_lanjut')) {
                $table->text('tindak_lanjut')->nullable()->after('hasil_observasi');
            }
            if (!Schema::hasColumn('l_k_s', 'dokumen')) {
                $table->json('dokumen')->nullable()->after('tindak_lanjut');
            }
        });
    }

    public function down(): void
    {
        Schema::table('l_k_s', function (Blueprint $table) {
            // Bisa di-drop jika mau rollback
            $columns = [
                'kelurahan', 'npwp', 'kontak_pengurus', 'akta_pendirian',
                'izin_operasional', 'legalitas', 'no_akta', 'status_akreditasi',
                'no_sertifikat', 'tanggal_akreditasi', 'koordinat', 'jumlah_pengurus',
                'sarana', 'hasil_observasi', 'tindak_lanjut', 'dokumen'
            ];
            foreach ($columns as $col) {
                if (Schema::hasColumn('l_k_s', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
