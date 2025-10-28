<?php

namespace App\Policies;

use App\Models\Donation;
use App\Models\User;

class DonationPolicy
{
    /**
     * Determine if the user can view any donations.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can view the donation.
     */
    public function view(User $user, Donation $donation): bool
    {
        return $user->id === $donation->user_id || $user->isAdmin();
    }

    /**
     * Determine if the user can create donations.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can donate
    }

    /**
     * Determine if the user can update the donation.
     */
    public function update(User $user, Donation $donation): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can delete the donation.
     */
    public function delete(User $user, Donation $donation): bool
    {
        return $user->isAdmin();
    }
}

