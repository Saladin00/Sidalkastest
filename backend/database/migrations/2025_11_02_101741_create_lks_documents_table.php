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
        Schema::create('lks_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lks_id')->constrained('l_k_s')->onDelete('cascade');
            $table->string('nama'); // contoh: "Akta Pendirian", "SK Kemenkumham"
            $table->string('file'); // path file dokumen
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lks_documents');
    }
};
