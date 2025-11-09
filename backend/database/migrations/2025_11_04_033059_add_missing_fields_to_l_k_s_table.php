<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            // Tambahkan kolom hanya jika belum ada (aman untuk database lama)
            if (!Schema::hasColumn('lks', 'kelurahan')) {
                $table->string('kelurahan')->nullable()->after('kecamatan');
            }
            if (!Schema::hasColumn('lks', 'npwp')) {
                $table->string('npwp')->nullable()->after('kelurahan');
            }
            if (!Schema::hasColumn('lks', 'kontak_pengurus')) {
                $table->string('kontak_pengurus')->nullable()->after('npwp');
            }
            if (!Schema::hasColumn('lks', 'akta_pendirian')) {
                $table->string('akta_pendirian')->nullable()->after('kontak_pengurus');
            }
            if (!Schema::hasColumn('lks', 'izin_operasional')) {
                $table->string('izin_operasional')->nullable()->after('akta_pendirian');
            }
            if (!Schema::hasColumn('lks', 'legalitas')) {
                $table->string('legalitas')->nullable()->after('izin_operasional');
            }
            if (!Schema::hasColumn('lks', 'no_akta')) {
                $table->string('no_akta')->nullable()->after('legalitas');
            }
            if (!Schema::hasColumn('lks', 'status_akreditasi')) {
                $table->string('status_akreditasi')->nullable()->after('no_akta');
            }
            if (!Schema::hasColumn('lks', 'no_sertifikat')) {
                $table->string('no_sertifikat')->nullable()->after('status_akreditasi');
            }
            if (!Schema::hasColumn('lks', 'tanggal_akreditasi')) {
                $table->date('tanggal_akreditasi')->nullable()->after('no_sertifikat');
            }
            if (!Schema::hasColumn('lks', 'koordinat')) {
                $table->string('koordinat')->nullable()->after('tanggal_akreditasi');
            }
            if (!Schema::hasColumn('lks', 'jumlah_pengurus')) {
                $table->integer('jumlah_pengurus')->nullable()->after('koordinat');
            }
            if (!Schema::hasColumn('lks', 'sarana')) {
                $table->text('sarana')->nullable()->after('jumlah_pengurus');
            }
            if (!Schema::hasColumn('lks', 'hasil_observasi')) {
                $table->text('hasil_observasi')->nullable()->after('sarana');
            }
            if (!Schema::hasColumn('lks', 'tindak_lanjut')) {
                $table->text('tindak_lanjut')->nullable()->after('hasil_observasi');
            }
            if (!Schema::hasColumn('lks', 'dokumen')) {
                $table->json('dokumen')->nullable()->after('tindak_lanjut');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lks', function (Blueprint $table) {
            // Bisa di-drop jika mau rollback
            $columns = [
                'kelurahan', 'npwp', 'kontak_pengurus', 'akta_pendirian',
                'izin_operasional', 'legalitas', 'no_akta', 'status_akreditasi',
                'no_sertifikat', 'tanggal_akreditasi', 'koordinat', 'jumlah_pengurus',
                'sarana', 'hasil_observasi', 'tindak_lanjut', 'dokumen'
            ];
            foreach ($columns as $col) {
                if (Schema::hasColumn('lks', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
