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
            $table->string('church_centre')->nullable()->after('email_verified_at');
            $table->string('country')->nullable()->after('church_centre');
            $table->string('phone')->nullable()->after('country');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('phone');
            $table->boolean('church_member')->default(false)->after('gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['church_centre', 'country', 'phone', 'gender', 'church_member']);
        });
    }
};
