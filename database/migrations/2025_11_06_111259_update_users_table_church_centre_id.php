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
            // Add church_centre_id column
            $table->foreignId('church_centre_id')->nullable()->after('church_member')->constrained('church_centres')->nullOnDelete();
            
            // Drop old church_centre string column
            $table->dropColumn('church_centre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Re-add church_centre string column
            $table->string('church_centre')->nullable()->after('church_member');
            
            // Drop church_centre_id
            $table->dropForeign(['church_centre_id']);
            $table->dropColumn('church_centre_id');
        });
    }
};
