<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add series_id column
        Schema::table('sermons', function (Blueprint $table) {
            $table->foreignId('series_id')->nullable()->after('category_id')->constrained('sermon_series')->nullOnDelete();
        });

        // Migrate existing series string data to new table
        $existingSeries = DB::table('sermons')
            ->whereNotNull('series')
            ->where('series', '!=', '')
            ->distinct()
            ->pluck('series')
            ->toArray();

        $seriesMap = [];
        foreach ($existingSeries as $seriesName) {
            $slug = Str::slug($seriesName);
            $seriesId = DB::table('sermon_series')->insertGetId([
                'name' => $seriesName,
                'slug' => $slug,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $seriesMap[$seriesName] = $seriesId;
        }

        // Update sermons with series_id
        foreach ($seriesMap as $seriesName => $seriesId) {
            DB::table('sermons')
                ->where('series', $seriesName)
                ->update(['series_id' => $seriesId]);
        }

        // Drop old series column
        Schema::table('sermons', function (Blueprint $table) {
            $table->dropColumn('series');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sermons', function (Blueprint $table) {
            $table->string('series')->nullable()->after('category_id');
        });

        // Migrate series_id back to series string
        $sermonsWithSeries = DB::table('sermons')
            ->join('sermon_series', 'sermons.series_id', '=', 'sermon_series.id')
            ->select('sermons.id', 'sermon_series.name')
            ->get();

        foreach ($sermonsWithSeries as $sermon) {
            DB::table('sermons')
                ->where('id', $sermon->id)
                ->update(['series' => $sermon->name]);
        }

        Schema::table('sermons', function (Blueprint $table) {
            $table->dropForeign(['series_id']);
            $table->dropColumn('series_id');
        });
    }
};
