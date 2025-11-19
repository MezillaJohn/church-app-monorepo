<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\SermonController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\DonationController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\HeroSliderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\RegistrationController;
use App\Http\Controllers\Api\V1\PushTokenController;
use App\Http\Controllers\Api\V1\ChurchCentreController;
use App\Http\Controllers\Api\V1\SeriesController;
use App\Http\Controllers\Api\V1\PartnershipController;
use App\Http\Controllers\Api\V1\SiteInfoController;

Route::prefix('v1')->group(function () {
    // Public Authentication routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/validate-email', [AuthController::class, 'validateEmail']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    // Email verification routes
    Route::post('/auth/email/verify', [AuthController::class, 'verifyEmail'])->middleware('auth:sanctum');
    Route::post('/auth/email/resend', [AuthController::class, 'resendVerification'])->middleware('auth:sanctum');

    Route::get('/books/featured', [BookController::class, 'featured']);

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
        Route::post('/books/{id}/rate', [BookController::class, 'rateBook']);
        Route::get('/books/{id}', [BookController::class, 'show']);

        //Events
        Route::post('/events/{id}/rsvp', [EventController::class, 'rsvp']);
        Route::delete('/events/{id}/rsvp', [EventController::class, 'cancelRsvp']);
        Route::get('/events/my-rsvps', [EventController::class, 'myRsvps']);
        Route::post('/events/{id}/reminder', [EventController::class, 'setReminder']);
        Route::delete('/events/{id}/reminder', [EventController::class, 'removeReminder']);
        Route::get('/events/reminder-settings', [EventController::class, 'getReminderSettings']);

        //Giving
        Route::post('/giving/donate', [DonationController::class, 'donate']);
        Route::get('/giving/history', [DonationController::class, 'history']);
        Route::get('/giving/total', [DonationController::class, 'totalDonations']);

        //Partnerships
        Route::post('/partnerships', [PartnershipController::class, 'store']);

        //Payment
        Route::post('/books/{id}/purchase', [PaymentController::class, 'purchaseBook']);
        Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);

        //Push Tokens
        Route::get('/push-tokens', [PushTokenController::class, 'index']);
        Route::post('/push-tokens', [PushTokenController::class, 'store']);
        Route::delete('/push-tokens/{id}', [PushTokenController::class, 'destroy']);
    });

    // Sermon routes 
    Route::get('/sermons', [SermonController::class, 'index']);
    Route::get('/sermons/{id}', [SermonController::class, 'show']);


    // Book routes
    Route::get('/books', [BookController::class, 'index']);



    // Event routes (public)
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);



    // Giving routes 
    Route::get('/giving/types', [DonationController::class, 'getDonationTypes']);
    Route::get('/giving/methods', [DonationController::class, 'getPaymentMethods']);

    // Partnership routes (public)
    Route::get('/partnerships/types', [PartnershipController::class, 'getPartnershipTypes']);

    // Hero Slider routes (public)
    Route::get('/hero-sliders', [HeroSliderController::class, 'index']);

    // Church Centre routes (public)
    Route::get('/church-centres', [ChurchCentreController::class, 'index']);

    // Category routes (public)
    Route::get('/categories/sermons', [CategoryController::class, 'getSermonCategories']);
    Route::get('/categories/books', [CategoryController::class, 'getBookCategories']);

    // Series routes (public)
    Route::get('/series', [SeriesController::class, 'index']);
    Route::get('/series/{id}', [SeriesController::class, 'show']);

    // Site Info routes (public)
    Route::get('/site-info', [SiteInfoController::class, 'index']);

    // Registration (public)
    Route::post('/auth/register/request-code', [RegistrationController::class, 'requestCode']);
    Route::post('/auth/register/resend-code', [RegistrationController::class, 'resendCode']);
    Route::post('/auth/register/verify-code', [RegistrationController::class, 'verifyCode']);
    Route::post('/auth/register/set-password', [RegistrationController::class, 'setPassword']);

});

// Webhook routes (public - no authentication)
Route::post('/v1/webhooks/paystack', [PaymentController::class, 'handleWebhook']);
Route::get('/v1/verify-payment', [PaymentController::class, 'verifyPayment']);

