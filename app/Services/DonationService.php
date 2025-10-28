<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\BankAccount;
use App\Models\User;
use App\Enums\DonationType;
use App\Enums\PaymentMethod;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DonationService
{
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
            'note' => $data['note'] ?? null,
            'is_anonymous' => $data['is_anonymous'] ?? false,
            'status' => 'pending',
        ]);
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

