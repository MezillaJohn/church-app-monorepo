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
        Schema::table('donations', function (Blueprint $table) {
            // Add new columns
            $table->foreignId('donation_type_id')->nullable()->after('user_id')->constrained('donation_types')->cascadeOnDelete();
            $table->string('currency', 3)->default('NGN')->after('amount');
            $table->decimal('amount_in_ngn', 10, 2)->nullable()->after('currency');
        });

        // Migrate existing data from donation_type enum to donation_type_id
        $this->migrateExistingDonationTypes();

        // Drop the old donation_type enum column
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn('donation_type');
        });

        // Make donation_type_id non-nullable after migration
        Schema::table('donations', function (Blueprint $table) {
            $table->foreignId('donation_type_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            // Re-add the donation_type enum column
            $table->enum('donation_type', ['tithe', 'offering', 'special', 'missions'])->after('amount');
        });

        // Migrate data back from donation_type_id to donation_type enum
        $this->restoreExistingDonationTypes();

        Schema::table('donations', function (Blueprint $table) {
            // Drop new columns
            $table->dropForeign(['donation_type_id']);
            $table->dropColumn(['donation_type_id', 'currency', 'amount_in_ngn']);
        });
    }

    /**
     * Migrate existing donation types to new structure
     */
    private function migrateExistingDonationTypes(): void
    {
        $typeMapping = [
            'tithe' => 'Tithe',
            'offering' => 'Offering',
            'special' => 'Special',
            'missions' => 'Missions',
        ];

        foreach ($typeMapping as $oldType => $newTypeName) {
            $donationType = \App\Models\DonationType::where('name', $newTypeName)->first();
            if ($donationType) {
                \DB::table('donations')
                    ->where('donation_type', $oldType)
                    ->update([
                        'donation_type_id' => $donationType->id,
                        'amount_in_ngn' => \DB::raw('amount'), // Assume existing donations are in NGN
                    ]);
            }
        }

        // Handle any remaining NULL donation_type_id values by assigning them to "Offering"
        $defaultType = \App\Models\DonationType::where('name', 'Offering')->first();
        if ($defaultType) {
            \DB::table('donations')
                ->whereNull('donation_type_id')
                ->update([
                    'donation_type_id' => $defaultType->id,
                    'amount_in_ngn' => \DB::raw('IFNULL(amount_in_ngn, amount)'), // Use existing amount if amount_in_ngn is null
                ]);
        }
    }

    /**
     * Restore donation types for rollback
     */
    private function restoreExistingDonationTypes(): void
    {
        $donations = \DB::table('donations')->get();

        foreach ($donations as $donation) {
            $donationType = \App\Models\DonationType::find($donation->donation_type_id);
            if ($donationType) {
                $oldType = strtolower($donationType->name);
                \DB::table('donations')
                    ->where('id', $donation->id)
                    ->update(['donation_type' => $oldType]);
            }
        }
    }
};
