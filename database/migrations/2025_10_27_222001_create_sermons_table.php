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
        Schema::create('sermons', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['audio', 'video']);
            $table->string('speaker')->nullable();
            $table->date('date');
            $table->string('audio_file_url')->nullable();
            $table->string('youtube_video_id')->nullable();
            $table->string('youtube_video_url')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->integer('duration')->nullable(); // in seconds
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('series')->nullable();
            $table->integer('views')->default(0);
            $table->integer('favorites_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sermons');
    }
};
