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
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(false)->after('is_published');
            $table->string('recurrence_pattern')->nullable()->after('is_recurring'); // daily, weekly, monthly, yearly
            $table->integer('recurrence_interval')->nullable()->after('recurrence_pattern'); // every N days/weeks/months
            $table->date('recurrence_end_date')->nullable()->after('recurrence_interval');
            $table->integer('recurrence_count')->nullable()->after('recurrence_end_date'); // number of occurrences
            $table->foreignId('parent_event_id')->nullable()->constrained('events')->nullOnDelete()->after('recurrence_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['parent_event_id']);
            $table->dropColumn([
                'is_recurring',
                'recurrence_pattern',
                'recurrence_interval',
                'recurrence_end_date',
                'recurrence_count',
                'parent_event_id',
            ]);
        });
    }
};
