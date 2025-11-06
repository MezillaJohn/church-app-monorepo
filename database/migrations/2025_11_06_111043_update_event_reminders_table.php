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
        Schema::table('event_reminders', function (Blueprint $table) {
            $table->foreignId('reminder_setting_id')->nullable()->after('event_id')->constrained('event_reminder_settings')->cascadeOnDelete();
            $table->timestamp('notification_sent_at')->nullable()->after('is_sent');
            $table->timestamp('email_sent_at')->nullable()->after('notification_sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_reminders', function (Blueprint $table) {
            $table->dropForeign(['reminder_setting_id']);
            $table->dropColumn(['reminder_setting_id', 'notification_sent_at', 'email_sent_at']);
        });
    }
};
