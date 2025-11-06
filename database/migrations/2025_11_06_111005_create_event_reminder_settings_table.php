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
        Schema::create('event_reminder_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "1 hour before"
            $table->integer('minutes_before'); // e.g., 60 for 1 hour
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_reminder_settings');
    }
};
