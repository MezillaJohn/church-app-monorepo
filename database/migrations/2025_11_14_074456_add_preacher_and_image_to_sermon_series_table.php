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
        Schema::table('sermon_series', function (Blueprint $table) {
            $table->string('preacher')->nullable()->after('description');
            $table->string('image')->nullable()->after('preacher');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sermon_series', function (Blueprint $table) {
            $table->dropColumn(['preacher', 'image']);
        });
    }
};
