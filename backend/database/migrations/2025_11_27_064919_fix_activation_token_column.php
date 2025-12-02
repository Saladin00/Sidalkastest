<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            
            // Buang kolom rusak (walaupun ada)
            if (Schema::hasColumn('users', 'activation_token')) {
                $table->dropColumn('activation_token');
            }

            // Buat ulang kolom dengan benar
            $table->string('activation_token', 255)
                  ->nullable()
                  ->after('status_aktif');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'activation_token')) {
                $table->dropColumn('activation_token');
            }
        });
    }
};
