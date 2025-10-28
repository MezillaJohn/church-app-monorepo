<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sermon_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('sermon_id')->constrained('sermons')->cascadeOnDelete();
            $table->integer('progress')->default(0); // in seconds
            $table->boolean('is_completed')->default(false);
            $table->timestamps();

            // One progress record per user per sermon
            $table->unique(['user_id', 'sermon_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sermon_progress');
    }
};
