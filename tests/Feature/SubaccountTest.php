<?php

use App\Models\Donation;
use App\Models\DonationType;
use App\Models\Subaccount;
use App\Models\User;
use App\Services\DonationService;
use App\Services\PaystackService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

uses(RefreshDatabase::class);

test('paystack service can create subaccount', function () {
    $paystackService = \Illuminate\Support\Facades\App::make(PaystackService::class);

    // We cannot easily mock the Http facade inside the service without refactoring or using Http::fake()
    // but PaystackService uses Http facade.

    \Illuminate\Support\Facades\Http::fake([
        'api.paystack.co/subaccount' => \Illuminate\Support\Facades\Http::response([
            'status' => true,
            'message' => 'Subaccount created',
            'data' => [
                'subaccount_code' => 'SUB_123456',
                'business_name' => 'Test Business',
            ]
        ], 200),
    ]);

    $data = [
        'business_name' => 'Test Business',
        'settlement_bank' => '058',
        'account_number' => '0123456789',
        'percentage_charge' => 20,
    ];

    $response = $paystackService->createSubaccount($data);

    expect($response['subaccount_code'])->toBe('SUB_123456');
});

test('donation service initiates payment with subaccount', function () {
    $user = User::factory()->create();
    $subaccount = Subaccount::create([
        'business_name' => 'Test Biz',
        'paystack_subaccount_code' => 'SUB_TEST123',
        'created_by' => $user->id,
        'creation_method' => 'manual',
    ]);

    $donationType = DonationType::create([
        'name' => 'Building Fund',
        'subaccount_id' => $subaccount->id,
    ]);

    $donation = Donation::create([
        'user_id' => $user->id,
        'donation_type_id' => $donationType->id,
        'amount' => 5000,
        'currency' => 'NGN',
        'amount_in_ngn' => 5000,
        'payment_method' => \App\Enums\PaymentMethod::Paystack,
        'status' => 'pending',
    ]);

    $mockPaystack = $this->mock(PaystackService::class, function (MockInterface $mock) use ($subaccount) {
        $mock->shouldReceive('generateReference')->andReturn('REF_123');
        $mock->shouldReceive('initializeTransaction')
            ->withArgs(function ($data) use ($subaccount) {
                return isset($data['subaccount']) && $data['subaccount'] === $subaccount->paystack_subaccount_code;
            })
            ->once()
            ->andReturn(['reference' => 'REF_123', 'authorization_url' => 'http://paystack.com/pay/123']);
    });

    $donationService = new DonationService($mockPaystack);
    $url = $donationService->initiatePayment($donation, $user);

    expect($url)->toBe('http://paystack.com/pay/123');
});

test('donation service initiates payment without subaccount', function () {
    $user = User::factory()->create();
    $donationType = DonationType::create([
        'name' => 'General',
        'subaccount_id' => null,
    ]);

    $donation = Donation::create([
        'user_id' => $user->id,
        'donation_type_id' => $donationType->id,
        'amount' => 5000,
        'currency' => 'NGN',
        'amount_in_ngn' => 5000,
        'payment_method' => \App\Enums\PaymentMethod::Paystack,
        'status' => 'pending',
    ]);

    $mockPaystack = $this->mock(PaystackService::class, function (MockInterface $mock) {
        $mock->shouldReceive('generateReference')->andReturn('REF_456');
        $mock->shouldReceive('initializeTransaction')
            ->withArgs(function ($data) {
                return !isset($data['subaccount']);
            })
            ->once()
            ->andReturn(['reference' => 'REF_456', 'authorization_url' => 'http://paystack.com/pay/456']);
    });

    $donationService = new DonationService($mockPaystack);
    $url = $donationService->initiatePayment($donation, $user);

    expect($url)->toBe('http://paystack.com/pay/456');
});
