<?php

namespace App\Console\Commands;

use App\Services\YouTubeService;
use Illuminate\Console\Command;

class SyncYouTubeSermons extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sermons:sync-youtube';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync sermons from YouTube channel';

    /**
     * Execute the console command.
     */
    public function handle(YouTubeService $service): int
    {
        $this->info('Starting YouTube sermon sync...');

        $channelId = config('youtube.channel_id');

        if (! $channelId) {
            $this->error('YouTube channel ID not configured. Please set YOUTUBE_CHANNEL_ID in .env');

            return Command::FAILURE;
        }

        if (! config('youtube.api_key')) {
            $this->error('YouTube API key not configured. Please set YOUTUBE_API_KEY in .env');

            return Command::FAILURE;
        }

        $results = $service->syncVideosToSermons($channelId);

        $this->info('Sync completed!');
        $this->info("  Added: {$results['added']}");
        $this->info("  Skipped: {$results['skipped']}");

        if (! empty($results['errors'])) {
            $this->error('Errors encountered:');
            foreach ($results['errors'] as $error) {
                $this->error("  - {$error}");
            }

            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
