<?php

namespace App\Services;

use App\Models\Sermon;
use Google_Client;
use Google_Service_YouTube;
use Illuminate\Support\Facades\Log;

class YouTubeService
{
    protected Google_Service_YouTube $youtube;

    public function __construct()
    {
        $client = new Google_Client;
        $client->setDeveloperKey(config('youtube.api_key'));
        $this->youtube = new Google_Service_YouTube($client);
    }

    /**
     * Fetch videos from YouTube channel
     */
    public function fetchChannelVideos(string $channelId, int $maxResults = 50): array
    {
        try {
            // Get channel uploads playlist ID
            $channelResponse = $this->youtube->channels->listChannels(
                'contentDetails',
                ['id' => $channelId]
            );

            if (empty($channelResponse->getItems())) {
                Log::error("YouTube channel not found: {$channelId}");

                return [];
            }

            $uploadsPlaylistId = $channelResponse->getItems()[0]->getContentDetails()->getRelatedPlaylists()->getUploads();

            // Get videos from uploads playlist
            $playlistItemsResponse = $this->youtube->playlistItems->listPlaylistItems(
                'snippet,contentDetails',
                [
                    'playlistId' => $uploadsPlaylistId,
                    'maxResults' => $maxResults,
                    'order' => 'date',
                ]
            );

            return $this->extractVideos($playlistItemsResponse);
        } catch (\Exception $e) {
            Log::error('YouTube API Error: '.$e->getMessage());

            return [];
        }
    }

    /**
     * Extract video details
     */
    protected function extractVideos($playlistItems): array
    {
        $videos = [];

        foreach ($playlistItems->getItems() as $item) {
            $snippet = $item->getSnippet();
            $videoId = $snippet->getResourceId()->getVideoId();

            $videos[] = [
                'video_id' => $videoId,
                'title' => $snippet->getTitle(),
                'description' => $snippet->getDescription(),
                'thumbnail' => $snippet->getThumbnails()->getMedium()->getUrl(),
                'published_at' => $snippet->getPublishedAt(),
            ];
        }

        return $videos;
    }

    /**
     * Get detailed video information
     */
    public function getVideoDetails(string $videoId): ?array
    {
        try {
            $response = $this->youtube->videos->listVideos(
                'snippet,contentDetails',
                ['id' => $videoId]
            );

            if (empty($response->getItems())) {
                return null;
            }

            $video = $response->getItems()[0];
            $snippet = $video->getSnippet();
            $details = $video->getContentDetails();

            return [
                'video_id' => $videoId,
                'title' => $snippet->getTitle(),
                'description' => $snippet->getDescription(),
                'thumbnail' => $snippet->getThumbnails()->getHigh()->getUrl(),
                'duration' => $this->parseDuration($details->getDuration()),
                'published_at' => $snippet->getPublishedAt(),
            ];
        } catch (\Exception $e) {
            Log::error("Error fetching video details for {$videoId}: ".$e->getMessage());

            return null;
        }
    }

    /**
     * Parse YouTube duration (PT4M13S) to seconds
     */
    protected function parseDuration(string $duration): int
    {
        $interval = new \DateInterval($duration);

        return ($interval->h * 3600) + ($interval->i * 60) + $interval->s;
    }

    /**
     * Sync videos to sermons table
     */
    public function syncVideosToSermons(string $channelId): array
    {
        $results = [
            'added' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        $videos = $this->fetchChannelVideos($channelId);

        foreach ($videos as $video) {
            // Check if video already exists
            $exists = Sermon::where('youtube_video_id', $video['video_id'])->exists();

            if ($exists) {
                $results['skipped']++;

                continue;
            }

            // Get detailed video information
            $details = $this->getVideoDetails($video['video_id']);

            if (! $details) {
                $results['errors'][] = "Failed to fetch details for video: {$video['video_id']}";

                continue;
            }

            try {
                Sermon::create([
                    'title' => $details['title'],
                    'description' => $details['description'],
                    'type' => \App\Enums\SermonType::Video,
                    'youtube_video_id' => $details['video_id'],
                    'thumbnail_url' => $details['thumbnail'],
                    'duration' => $details['duration'],
                    'date' => new \DateTime($details['published_at']),
                    'is_published' => true,
                ]);

                $results['added']++;
                Log::info("Synced sermon: {$details['title']}");
            } catch (\Exception $e) {
                $results['errors'][] = "Error creating sermon for {$details['video_id']}: ".$e->getMessage();
            }
        }

        return $results;
    }
}
