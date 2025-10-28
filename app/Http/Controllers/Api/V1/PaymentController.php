<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Models\BookPurchase;
use App\Models\Donation;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends BaseController
{
    public function __construct(private PaystackService $paystackService)
    {
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

            $paymentData = $this->paystackService->initializeTransaction([
                'email' => $email,
                'amount' => $book->price,
                'reference' => $reference,
                'metadata' => [
                    'type' => 'book_purchase',
                    'book_id' => $book->id,
                    'user_id' => $request->user()->id,
                ],
            ]);

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
            BookPurchase::where('user_id', $metadata['user_id'])
                ->where('book_id', $metadata['book_id'])
                ->where('transaction_reference', $transaction['reference'])
                ->update([
                    'status' => 'completed',
                    'updated_at' => now(),
                ]);

            // TODO: Dispatch job to send purchase receipt email
            // dispatch(new SendPurchaseReceipt($metadata['user_id'], $metadata['book_id']));

            Log::info("Book purchase completed: User {$metadata['user_id']}, Book {$metadata['book_id']}");
        });
    }

    /**
     * Complete donation
     */
    protected function completeDonation(array $metadata, array $transaction): void
    {
        DB::transaction(function () use ($metadata, $transaction) {
            Donation::where('user_id', $metadata['user_id'])
                ->where('transaction_reference', $transaction['reference'])
                ->update([
                    'status' => 'completed',
                    'updated_at' => now(),
                ]);

            // TODO: Dispatch job to send donation receipt email
            // dispatch(new SendDonationReceipt($metadata['user_id'], $transaction['reference']));

            Log::info("Donation completed: User {$metadata['user_id']}, Amount {$transaction['amount']}");
        });
    }
}

