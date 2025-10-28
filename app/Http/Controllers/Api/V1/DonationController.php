<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\BankAccountResource;
use App\Http\Resources\Api\V1\DonationResource;
use App\Services\DonationService;
use Illuminate\Http\Request;

class DonationController extends BaseController
{
    public function __construct(private DonationService $donationService)
    {
    }

    public function getPaymentMethods()
    {
        try {
            $methods = $this->donationService->getPaymentMethods();
            return $this->ok('Payment methods retrieved successfully', $methods);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve payment methods', ['exception' => $e->getMessage()], 500);
        }
    }

    public function donate(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'donation_type' => 'required|in:tithe,offering,special,missions',
                'payment_method' => 'required|in:paystack,manual',
                'note' => 'sometimes|string|max:500',
                'is_anonymous' => 'sometimes|boolean',
            ]);

            $donation = $this->donationService->createDonation($request->user(), $request->all());
            $user = $request->user();

            // Handle payment based on payment method
            $responseData = [
                'donation' => new DonationResource($donation),
            ];

            if ($request->payment_method === 'paystack') {
                // Generate Paystack payment URL
                $paymentUrl = $this->donationService->initiatePayment($donation, $user);
                $responseData['payment_url'] = $paymentUrl;
            } elseif ($request->payment_method === 'manual') {
                // Return bank account details for manual payment
                $bankAccounts = $this->donationService->getBankAccounts();
                $responseData['bank_accounts'] = BankAccountResource::collection($bankAccounts);
            }

            return $this->ok('Donation created successfully', $responseData);
        } catch (\Exception $e) {
            return $this->error('Failed to create donation', ['exception' => $e->getMessage()], 500);
        }
    }

    public function history(Request $request)
    {
        try {
            $donations = $this->donationService->getUserDonations($request->user(), $request->all());
            return $this->ok('Donation history retrieved successfully', DonationResource::collection($donations));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve donation history', ['exception' => $e->getMessage()], 500);
        }
    }

    public function totalDonations(Request $request)
    {
        try {
            $total = $this->donationService->getTotalDonations($request->user());
            return $this->ok('Total donations retrieved successfully', ['total' => $total]);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve total donations', ['exception' => $e->getMessage()], 500);
        }
    }
}
