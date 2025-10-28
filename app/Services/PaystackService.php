<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackService
{
    protected ?string $secretKey;
    protected ?string $publicKey;

    public function __construct()
    {
        $this->secretKey = config('paystack.secret_key');
        $this->publicKey = config('paystack.public_key');
    }

    /**
     * Initialize a payment transaction
     */
    public function initializeTransaction(array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->secretKey}",
                'Content-Type' => 'application/json',
            ])->post('https://api.paystack.co/transaction/initialize', [
                        'email' => $data['email'],
                        'amount' => $data['amount'] * 100, // Convert to kobo
                        'reference' => $data['reference'] ?? $this->generateReference(),
                        'callback_url' => $data['callback_url'] ?? config('paystack.callback_url'),
                        'metadata' => $data['metadata'] ?? [],
                    ]);

            if ($response->successful()) {
                return $response->json('data');
            }

            throw new \Exception('Paystack initialization failed: ' . $response->json('message'));
        } catch (\Exception $e) {
            Log::error('Paystack initialization error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Verify a payment transaction
     */
    public function verifyTransaction(string $reference): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->secretKey}",
            ])->get("https://api.paystack.co/transaction/verify/{$reference}");

            if ($response->successful()) {
                return $response->json('data');
            }

            throw new \Exception('Paystack verification failed: ' . $response->json('message'));
        } catch (\Exception $e) {
            Log::error('Paystack verification error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate a unique transaction reference
     */
    public function generateReference(): string
    {
        return 'GODHOUSE-' . time() . '-' . uniqid();
    }

    /**
     * Get public key for frontend
     */
    public function getPublicKey(): string
    {
        return $this->publicKey;
    }
}

