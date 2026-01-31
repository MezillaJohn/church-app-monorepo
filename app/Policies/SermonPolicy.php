<?php

namespace App\Policies;

use App\Models\Sermon;
use App\Models\User;

class SermonPolicy
{
    /**
     * Determine if the user can view any sermons.
     */
    public function viewAny(?User $user): bool
    {
        return true; // Anyone can view published sermons
    }

    /**
     * Determine if the user can view the sermon.
     */
    public function view(?User $user, Sermon $sermon): bool
    {
        return $sermon->is_published || ($user && $user->isAdmin());
    }

    /**
     * Determine if the user can create sermons.
     */
    public function create(User $user): bool
    {
        // Allow all authenticated users in admin panel
        // TODO: Implement proper role check when roles are configured
        return $user->isAdmin();
    }

    /**
     * Determine if the user can update the sermon.
     */
    public function update(User $user, Sermon $sermon): bool
    {
        // Allow all authenticated users in admin panel
        // TODO: Implement proper role check when roles are configured
        return $user->isAdmin();
    }

    /**
     * Determine if the user can delete the sermon.
     */
    public function delete(User $user, Sermon $sermon): bool
    {
        // Allow all authenticated users in admin panel
        // TODO: Implement proper role check when roles are configured
        return $user->isAdmin();
    }
}
