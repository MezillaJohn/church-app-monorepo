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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->enum('donation_type', ['tithe', 'offering', 'special', 'missions']);
            $table->enum('payment_method', ['paystack', 'manual']);
            $table->string('payment_gateway')->nullable();
            $table->string('transaction_reference')->nullable();
            $table->string('status')->default('pending'); // pending, completed, failed
            $table->text('note')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->string('proof_of_payment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
