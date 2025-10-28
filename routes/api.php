<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\SermonController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\DonationController;
use App\Http\Controllers\Api\V1\PaymentController;

Route::prefix('v1')->group(function () {
    // Public Authentication routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    // Email verification routes
    Route::post('/auth/email/verify', [AuthController::class, 'verifyEmail'])->middleware('auth:sanctum');
    Route::post('/auth/email/resend', [AuthController::class, 'resendVerification'])->middleware('auth:sanctum');

    // Authentication routes (protected - requires email verification)
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

        //Sermons
        Route::post('/sermons/{id}/favorite', [SermonController::class, 'toggleFavorite']);
        Route::get('/sermons/favorites', [SermonController::class, 'favorites']);
        Route::post('/sermons/{id}/watch-later', [SermonController::class, 'addToWatchLater']);
        Route::get('/sermons/watch-later', [SermonController::class, 'watchLater']);
        Route::post('/sermons/{id}/progress', [SermonController::class, 'updateProgress']);
        Route::get('/sermons/{id}/progress', [SermonController::class, 'getProgress']);

        //Books
        Route::get('/library/my-books', [BookController::class, 'myBooks']);
        Route::get('/books/{id}/check-purchase', [BookController::class, 'checkPurchase']);

        //Events
        Route::post('/events/{id}/rsvp', [EventController::class, 'rsvp']);
        Route::delete('/events/{id}/rsvp', [EventController::class, 'cancelRsvp']);
        Route::get('/events/my-rsvps', [EventController::class, 'myRsvps']);
        Route::post('/events/{id}/reminder', [EventController::class, 'setReminder']);
        Route::delete('/events/{id}/reminder', [EventController::class, 'removeReminder']);

        //Giving
        Route::post('/giving/donate', [DonationController::class, 'donate']);
        Route::get('/giving/history', [DonationController::class, 'history']);
        Route::get('/giving/total', [DonationController::class, 'totalDonations']);
    });

    // Sermon routes (public)
    Route::get('/sermons', [SermonController::class, 'index']);
    Route::get('/sermons/{id}', [SermonController::class, 'show']);


    // Book routes (public)
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/featured', [BookController::class, 'featured']);
    Route::get('/books/{id}', [BookController::class, 'show']);


    // Event routes (public)
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);



    // Giving routes (public)
    Route::get('/giving/methods', [DonationController::class, 'getPaymentMethods']);


    // Payment routes (protected)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/books/{id}/purchase', [PaymentController::class, 'purchaseBook']);
        Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);
    });
});

// Webhook routes (public - no authentication)
Route::post('/v1/webhooks/paystack', [PaymentController::class, 'handleWebhook']);

