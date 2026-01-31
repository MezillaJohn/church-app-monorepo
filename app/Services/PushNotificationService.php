<?php

namespace App\Services;

use App\Models\PushToken;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    /**
     * Expo API endpoint
     */
    protected string $expoApiUrl;

    /**
     * Maximum tokens per batch (Expo allows up to 100)
     */
    protected int $batchSize;

    public function __construct()
    {
        $this->expoApiUrl = config('notifications.expo.api_url', 'https://exp.host/--/api/v2/push/send');
        $this->batchSize = config('notifications.expo.batch_size', 100);
    }

    /**
     * Send notification to single or multiple tokens
     */
    public function sendNotification(array $tokens, string $title, string $body, array $data = []): array
    {
        $messages = array_map(function ($token) use ($title, $body, $data) {
            return [
                'to' => $token,
                'sound' => 'default',
                'title' => $title,
                'body' => $body,
                'data' => $data,
                'priority' => 'default',
                'badge' => 1,
            ];
        }, $tokens);

        return $this->sendBatch($messages);
    }

    /**
     * Send notification to a single user (all active tokens)
     */
    public function sendToUser(User $user, string $title, string $body, array $data = []): array
    {
        $tokens = $user->pushTokens()
            ->active()
            ->pluck('token')
            ->toArray();

        if (empty($tokens)) {
            Log::info("No active push tokens found for user {$user->id}");

            return ['success' => false, 'message' => 'No active tokens found'];
        }

        return $this->sendNotification($tokens, $title, $body, $data);
    }

    /**
     * Send notification to multiple users
     */
    public function sendToUsers(Collection $users, string $title, string $body, array $data = []): array
    {
        $tokens = PushToken::whereIn('user_id', $users->pluck('id'))
            ->active()
            ->pluck('token')
            ->toArray();

        if (empty($tokens)) {
            Log::info('No active push tokens found for users');

            return ['success' => false, 'message' => 'No active tokens found'];
        }

        return $this->sendNotification($tokens, $title, $body, $data);
    }

    /**
     * Send batch of messages to Expo API
     */
    protected function sendBatch(array $messages): array
    {
        $results = [];
        $chunks = array_chunk($messages, $this->batchSize);

        foreach ($chunks as $chunk) {
            try {
                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Accept-encoding' => 'gzip, deflate',
                    'Content-Type' => 'application/json',
                ])->post($this->expoApiUrl.'?useFcmV1=true', $chunk);

                $responseData = $response->json();

                if ($response->successful()) {
                    $results[] = [
                        'success' => true,
                        'data' => $responseData,
                    ];

                    // Handle errors in response (e.g., invalid tokens)
                    if (isset($responseData['data']) && is_array($responseData['data'])) {
                        $this->handleResponseErrors($responseData['data'], $chunk);
                    }
                } else {
                    $results[] = [
                        'success' => false,
                        'error' => $responseData ?? $response->body(),
                    ];
                    Log::error('Push notification failed', [
                        'status' => $response->status(),
                        'response' => $responseData ?? $response->body(),
                    ]);
                }
            } catch (\Exception $e) {
                $results[] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
                Log::error('Push notification exception', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        return $results;
    }

    /**
     * Handle errors from Expo API response
     */
    protected function handleResponseErrors(array $responseData, array $messages): void
    {
        foreach ($responseData as $index => $item) {
            if (isset($item['status']) && $item['status'] === 'error') {
                $errorCode = $item['details']['error'] ?? null;
                $token = $messages[$index]['to'] ?? null;

                // Remove invalid tokens from database
                if ($errorCode === 'DeviceNotRegistered' && $token) {
                    PushToken::where('token', $token)->delete();
                    Log::info("Removed invalid push token: {$token}");
                }

                Log::warning('Push notification error', [
                    'token' => $token,
                    'error' => $item['message'] ?? 'Unknown error',
                    'error_code' => $errorCode,
                ]);
            }
        }
    }
}
