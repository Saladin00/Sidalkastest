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
    Schema::table('users', function (Blueprint $table) {
        // Tambah kolom activation_token
        $table->string('activation_token')->nullable()->after('status_aktif');

        // Ubah status_aktif default jadi false
        $table->boolean('status_aktif')->default(false)->change();
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('activation_token');
        $table->boolean('status_aktif')->default(true)->change();
    });
}

};
