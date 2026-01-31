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
            $table->string('password_reset_code', 6)->nullable()->after('remember_token');
            $table->timestamp('reset_code_expires_at')->nullable()->after('password_reset_code');
            $table->timestamp('reset_code_sent_at')->nullable()->after('reset_code_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['password_reset_code', 'reset_code_expires_at', 'reset_code_sent_at']);
        });
    }
};
