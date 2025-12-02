<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
{
    Schema::table('users', function (Blueprint $table) {

        if (Schema::hasColumn('users', 'activation_token')) {
            $table->renameColumn('activation_token', 'activation_code');
        }
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        if (Schema::hasColumn('users', 'activation_code')) {
            $table->renameColumn('activation_code', 'activation_token');
        }
    });
}

};
