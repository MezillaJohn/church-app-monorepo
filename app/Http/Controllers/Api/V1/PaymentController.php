<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Models\BookPurchase;
use App\Models\Donation;
use App\Models\Setting;
use App\Models\Subaccount;
use App\Models\User;
use App\Services\PaystackService;
use App\Services\PushNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends BaseController
{
    public function __construct(
        private PaystackService $paystackService,
        private ?PushNotificationService $pushNotificationService = null
    ) {
    }

    /**
     * Initialize book purchase payment
     */
    public function purchaseBook(Request $request, int $bookId)
    {
        $email = $request->user()->email;

        try {
            $book = \App\Models\Book::findOrFail($bookId);

            if (!$book->is_published) {
                return $this->error('Book is not available for purchase', [], 404);
            }

            // Check if already purchased
            $alreadyPurchased = BookPurchase::where('user_id', $request->user()->id)
                ->where('book_id', $bookId)
                ->where('status', 'completed')
                ->exists();

            if ($alreadyPurchased) {
                return $this->error('You have already purchased this book', [], 400);
            }

            $reference = $this->paystackService->generateReference();

            $paymentPayload = [
                'email' => $email,
                'amount' => $book->price,
                'reference' => $reference,
                'metadata' => [
                    'type' => 'book_purchase',
                    'book_id' => $book->id,
                    'user_id' => $request->user()->id,
                ],
            ];

            // Determine subaccount
            $subaccountCode = null;
            if ($book->subaccount_id) {
                // Use book-specific subaccount
                $subaccountCode = $book->subaccount->paystack_subaccount_code ?? null;
            } else {
                // Use default subaccount if configured
                $defaultSubaccountId = Setting::get('books.default_subaccount_id');
                if ($defaultSubaccountId) {
                    $defaultSubaccount = Subaccount::find($defaultSubaccountId);
                    $subaccountCode = $defaultSubaccount->paystack_subaccount_code ?? null;
                }
            }

            if ($subaccountCode) {
                $paymentPayload['subaccount'] = $subaccountCode;
            }

            $paymentData = $this->paystackService->initializeTransaction($paymentPayload);

            // Create pending purchase record
            BookPurchase::create([
                'user_id' => $request->user()->id,
                'book_id' => $book->id,
                'transaction_reference' => $reference,
                'price_paid' => $book->price,
                'status' => 'pending',
                'payment_method' => 'paystack',
            ]);

            return $this->ok('Payment initialized successfully', [
                'authorization_url' => $paymentData['authorization_url'],
                'access_code' => $paymentData['access_code'],
                'reference' => $reference,
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to initialize payment', ['exception' => $e->getMessage()], 500);
        }
    }

    /**
     * Verify payment
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'reference' => 'required|string',
        ]);

        try {
            $transaction = $this->paystackService->verifyTransaction($request->reference);

            if ($transaction['status'] !== 'success') {
                return $this->error('Payment verification failed', [], 400);
            }

            $metadata = $transaction['metadata'] ?? [];

            if ($metadata['type'] === 'book_purchase') {
                $this->completePurchase($metadata, $transaction);
            } elseif ($metadata['type'] === 'donation') {
                $this->completeDonation($metadata, $transaction);
            }

            return redirect()->away('https://godhouse.org');

            // return $this->ok('Payment verified successfully', [
            //     'status' => $transaction['status'],
            //     'amount' => $transaction['amount'] / 100,
            //     'reference' => $transaction['reference'],
            // ]);
        } catch (\Exception $e) {
            return $this->error('Failed to verify payment', ['exception' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle Paystack webhook
     */
    public function handleWebhook(Request $request)
    {
        // Verify webhook signature
        $signature = $request->header('x-paystack-signature');
        $body = $request->getContent();

        if ($signature !== hash_hmac('sha512', $body, config('paystack.secret_key'))) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'charge.success') {
            $metadata = $data['metadata'] ?? [];

            if ($metadata['type'] === 'book_purchase') {
                $this->completePurchase($metadata, $data);
            } elseif ($metadata['type'] === 'donation') {
                $this->completeDonation($metadata, $data);
            }
        }

        return response()->json(['message' => 'Webhook processed'], 200);
    }

    /**
     * Complete book purchase
     */
    protected function completePurchase(array $metadata, array $transaction): void
    {
        DB::transaction(function () use ($metadata, $transaction) {
            $purchase = BookPurchase::where('user_id', $metadata['user_id'])
                ->where('book_id', $metadata['book_id'])
                ->where('transaction_reference', $transaction['reference'])
                ->first();

            if ($purchase) {
                $purchase->update([
                    'status' => 'completed',
                    'updated_at' => now(),
                ]);

                // Send payment confirmation notification
                if ($this->pushNotificationService) {
                    try {
                        $user = User::find($metadata['user_id']);
                        $book = \App\Models\Book::find($metadata['book_id']);
                        if ($user && $book) {
                            $this->pushNotificationService->sendToUser(
                                $user,
                                'Payment Confirmed',
                                "Your purchase of '{$book->title}' has been confirmed",
                                [
                                    'type' => 'payment',
                                    'id' => $purchase->id,
                                    'book_id' => $book->id,
                                ]
                            );
                        }
                    } catch (\Exception $e) {
                        Log::error('Failed to send purchase notification', [
                            'error' => $e->getMessage(),
                            'user_id' => $metadata['user_id'],
                            'book_id' => $metadata['book_id'],
                        ]);
                    }
                }
            }

            Log::info("Book purchase completed: User {$metadata['user_id']}, Book {$metadata['book_id']}");
        });
    }

    /**
     * Complete donation
     */
    protected function completeDonation(array $metadata, array $transaction): void
    {
        DB::transaction(function () use ($metadata, $transaction) {
            $donation = Donation::where('user_id', $metadata['user_id'])
                ->where('transaction_reference', $transaction['reference'])
                ->first();

            if ($donation) {
                $donation->update([
                    'status' => 'completed',
                    'updated_at' => now(),
                ]);

                // Send payment confirmation notification
                if ($this->pushNotificationService) {
                    try {
                        $user = User::find($metadata['user_id']);
                        if ($user) {
                            $amount = number_format($transaction['amount'] / 100, 2);
                            $donationType = $donation->donation_type->value ?? 'donation';
                            $this->pushNotificationService->sendToUser(
                                $user,
                                'Payment Confirmed',
                                "Your {$donationType} of ₦{$amount} has been processed successfully",
                                [
                                    'type' => 'payment',
                                    'id' => $donation->id,
                                    'donation_type' => $donationType,
                                ]
                            );
                        }
                    } catch (\Exception $e) {
                        Log::error('Failed to send donation notification', [
                            'error' => $e->getMessage(),
                            'user_id' => $metadata['user_id'],
                            'donation_id' => $donation->id ?? null,
                        ]);
                    }
                }
            }

            Log::info("Donation completed: User {$metadata['user_id']}, Amount {$transaction['amount']}");
        });
    }
}
