<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\BankAccount;
use App\Models\User;
use App\Enums\DonationType;
use App\Enums\PaymentMethod;
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
        return Donation::create([
            'user_id' => $user->id,
            'amount' => $data['amount'],
            'donation_type' => DonationType::from($data['donation_type']),
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
        $data = [
            'email' => $user->email,
            'amount' => (int) $donation->amount,
            'reference' => $this->paystackService->generateReference(),
            'callback_url' => config('paystack.callback_url'),
            'metadata' => [
                'type' => 'donation',
                'donation_id' => $donation->id,
                'donation_type' => $donation->donation_type->value,
                'user_id' => $user->id,
            ],
        ];

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
        $query = Donation::where('user_id', $user->id);

        if (isset($filters['donation_type'])) {
            $query->where('donation_type', $filters['donation_type']);
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
            ->sum('amount');
    }
}

