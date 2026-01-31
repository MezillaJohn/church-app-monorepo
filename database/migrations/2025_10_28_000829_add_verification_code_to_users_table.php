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
            $table->string('email_verification_code', 6)->nullable()->after('email_verified_at');
            $table->timestamp('code_expires_at')->nullable()->after('email_verification_code');
            $table->timestamp('code_sent_at')->nullable()->after('code_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_verification_code', 'code_expires_at', 'code_sent_at']);
        });
    }
};
