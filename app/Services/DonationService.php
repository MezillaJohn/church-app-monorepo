<?php

namespace App\Services;

use App\Enums\PaymentMethod;
use App\Models\BankAccount;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class DonationService
{
    public function __construct(private PaystackService $paystackService)
    {
    }

    public function getPaymentMethods(): array
    {
        $bankAccounts = BankAccount::where('is_active', true)->get();

        return [
            'paystack' => true,
            'bank_accounts' => $bankAccounts,
        ];
    }

    public function createDonation(User $user, array $data): Donation
    {
        $currency = $data['currency'] ?? 'NGN';
        $amount = $data['amount'];

        // Calculate amount in NGN for reporting purposes
        $amountInNgn = $this->convertToNGN($amount, $currency);

        return Donation::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'donation_type_id' => $data['donation_type_id'],
            'currency' => $currency,
            'amount_in_ngn' => $amountInNgn,
            'payment_method' => PaymentMethod::from($data['payment_method']),
            'payment_gateway' => $data['payment_method'] === 'paystack' ? 'paystack' : null,
            'transaction_reference' => Str::uuid(),
            'note' => $data['note'] ?? null,
            'is_anonymous' => $data['is_anonymous'] ?? false,
            'status' => 'pending',
        ]);
    }

    /**
     * Initiate payment for Paystack
     */
    public function initiatePayment(Donation $donation, User $user): string
    {
        $donation->loadMissing('donationType.subaccount');
        
        $data = [
            'email' => $user->email,
            'amount' => $donation->amount,
            'currency' => $donation->currency,
            'reference' => $this->paystackService->generateReference(),
            'callback_url' => config('paystack.callback_url'),
            'metadata' => [
                'type' => 'donation',
                'donation_id' => $donation->id,
                'donation_type_id' => $donation->donation_type_id,
                'user_id' => $user->id,
                'currency' => $donation->currency,
            ],
        ];

        if ($donation->donationType && $donation->donationType->subaccount) {
            $data['subaccount'] = $donation->donationType->subaccount->paystack_subaccount_code;
        }

        $response = $this->paystackService->initializeTransaction($data);

        // Update donation with Paystack reference
        $donation->update([
            'transaction_reference' => $response['reference'],
        ]);

        return $response['authorization_url'];
    }

    /**
     * Get bank accounts for manual payment
     */
    public function getBankAccounts(): \Illuminate\Database\Eloquent\Collection
    {
        return BankAccount::where('is_active', true)->get();
    }

    public function getUserDonations(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Donation::where('user_id', $user->id)->with('donationType');

        if (isset($filters['donation_type_id'])) {
            $query->where('donation_type_id', $filters['donation_type_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function getTotalDonations(User $user): float
    {
        return Donation::where('user_id', $user->id)
            ->where('status', 'completed')
            ->sum('amount_in_ngn');
    }

    /**
     * Convert amount to NGN for reporting
     * Note: These are approximate rates. In production, consider using a currency API
     */
    private function convertToNGN(float $amount, string $currency): float
    {
        if ($currency === 'NGN') {
            return $amount;
        }

        // Approximate conversion rates (these should be updated regularly or fetched from an API)
        $rates = [
            'USD' => 1550.00, // 1 USD = 1550 NGN (example rate)
            'EUR' => 1680.00, // 1 EUR = 1680 NGN (example rate)
            'GBP' => 1950.00, // 1 GBP = 1950 NGN (example rate)
            'CAD' => 1140.00, // 1 CAD = 1140 NGN (example rate)
            'AUD' => 1000.00, // 1 AUD = 1000 NGN (example rate)
        ];

        $rate = $rates[$currency] ?? 1;

        return $amount * $rate;
    }
}
