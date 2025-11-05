<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('verifikasi_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('verifikasi_id')->constrained('verifikasi')->cascadeOnDelete();
            $t->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $t->string('aksi');                 // 'buat','unggah_foto','update_status','edit'
            $t->text('keterangan')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verifikasi_logs');
    }
};
