<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert the temporary paid access mode setting
        \DB::table('settings')->insert([
            'key' => 'books.temporary_paid_access_mode',
            'value' => '0',
            'type' => 'boolean',
            'group' => 'books',
            'description' => 'Temporary mode to make all books accessible without purchase verification',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the temporary paid access mode setting
        \DB::table('settings')->where('key', 'books.temporary_paid_access_mode')->delete();
    }
};
