<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'lks_id')) {
                $table->unsignedBigInteger('lks_id')->nullable()->after('id');
                $table->foreign('lks_id')->references('id')->on('lks')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'lks_id')) {
                $table->dropForeign(['lks_id']);
                $table->dropColumn('lks_id');
            }
        });
    }
};
