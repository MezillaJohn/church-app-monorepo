<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Determine if the user can view any events.
     */
    public function viewAny(?User $user): bool
    {
        return true; // Anyone can view published events
    }

    /**
     * Determine if the user can view the event.
     */
    public function view(?User $user, Event $event): bool
    {
        return $event->is_published || ($user && $user->isAdmin());
    }

    /**
     * Determine if the user can RSVP to the event.
     */
    public function rsvp(User $user, Event $event): bool
    {
        return $event->is_published && $event->requires_rsvp;
    }

    /**
     * Determine if the user can create events.
     */
    public function create(User $user): bool
    {
        // Allow all authenticated users in admin panel
        // TODO: Implement proper role check when roles are configured
        return true;
    }

    /**
     * Determine if the user can update the event.
     */
    public function update(User $user, Event $event): bool
    {
        // Allow all authenticated users in admin panel
        // TODO: Implement proper role check when roles are configured
        return true;
    }

    /**
     * Determine if the user can delete the event.
     */
    public function delete(User $user, Event $event): bool
    {
        // Allow all authenticated users in admin panel
        // TODO: Implement proper role check when roles are configured
        return true;
    }
}
