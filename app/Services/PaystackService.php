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
            $currency = $data['currency'] ?? 'NGN';
            $amount = $data['amount'];

            // Convert amount to smallest unit (kobo for NGN, cents for USD, etc.)
            $amountInSmallestUnit = $this->convertToSmallestUnit($amount, $currency);

            $payload = [
                'email' => $data['email'],
                'amount' => $amountInSmallestUnit,
                'currency' => $currency,
                'reference' => $data['reference'] ?? $this->generateReference(),
                'callback_url' => $data['callback_url'] ?? config('paystack.callback_url'),
                'metadata' => $data['metadata'] ?? [],
            ];

            if (isset($data['subaccount'])) {
                $payload['subaccount'] = $data['subaccount'];
            }

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->secretKey}",
                'Content-Type' => 'application/json',
            ])->post('https://api.paystack.co/transaction/initialize', $payload);

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
     * Convert amount to smallest currency unit
     */
    private function convertToSmallestUnit(float $amount, string $currency): int
    {
        // Most currencies use 100 as multiplier (e.g., kobo, cents)
        // Some currencies like JPY don't have decimal units
        $multipliers = [
            'NGN' => 100, // Kobo
            'USD' => 100, // Cents
            'EUR' => 100, // Cents
            'GBP' => 100, // Pence
            'CAD' => 100, // Cents
            'AUD' => 100, // Cents
            'JPY' => 1,   // No sub-unit
        ];

        $multiplier = $multipliers[$currency] ?? 100;

        return (int) ($amount * $multiplier);
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
     * Create a subaccount
     */
    public function createSubaccount(array $data): array
    {
        try {
            $payload = [
                'business_name' => $data['business_name'],
                'settlement_bank' => $data['settlement_bank'],
                'account_number' => $data['account_number'],
                'percentage_charge' => $data['percentage_charge'],
                'primary_contact_email' => $data['primary_contact_email'] ?? null,
                'primary_contact_name' => $data['primary_contact_name'] ?? null,
                'primary_contact_phone' => $data['primary_contact_phone'] ?? null,
            ];

            // Filter null values
            $payload = array_filter($payload, fn($value) => !is_null($value));

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->secretKey}",
                'Content-Type' => 'application/json',
            ])->post('https://api.paystack.co/subaccount', $payload);

            if ($response->successful()) {
                return $response->json('data');
            }

            throw new \Exception('Paystack subaccount creation failed: ' . $response->json('message'));
        } catch (\Exception $e) {
            Log::error('Paystack subaccount creation error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * List banks
     */
    public function listBanks(): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->secretKey}",
            ])->get('https://api.paystack.co/bank');

            if ($response->successful()) {
                return $response->json('data');
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Paystack list banks error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get public key for frontend
     */
    public function getPublicKey(): string
    {
        return $this->publicKey;
    }
}
