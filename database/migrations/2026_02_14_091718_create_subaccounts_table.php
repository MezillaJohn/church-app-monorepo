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
        Schema::create('subaccounts', function (Blueprint $table) {
            $table->id();
            $table->enum('creation_method', ['automatic', 'manual'])->default('manual');
            $table->string('business_name');
            $table->string('paystack_subaccount_code')->unique();
            $table->string('settlement_bank')->nullable();
            $table->string('account_number')->nullable();
            $table->decimal('percentage_charge', 5, 2)->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subaccounts');
    }
};
