<?php

use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it returns 404 when no event is live', function () {
    // Create an event that is clearly in the past
    Event::factory()->create([
        'title' => 'Past Event',
        'event_date' => now()->subDay(),
        'event_time' => now()->subDay()->toTimeString(),
        'is_published' => true,
    ]);

    // Create an event that is clearly in the future
    Event::factory()->create([
        'title' => 'Future Event',
        'event_date' => now()->addDay(),
        'event_time' => now()->addDay()->toTimeString(),
        'is_published' => true,
    ]);

    $response = $this->getJson('/api/v1/events/live');

    $response->assertNotFound();
});

test('it returns the latest live event when one exists', function () {
    // Create a live event (started 5 mins ago)
    $liveEvent = Event::factory()->create([
        'title' => 'Live Event',
        'event_date' => now(),
        'event_time' => now()->subMinutes(5)->toTimeString(),
        'is_published' => true,
    ]);

    $response = $this->getJson('/api/v1/events/live');

    $response->assertOk()
        ->assertJsonPath('data.title', 'Live Event')
        ->assertJsonPath('data.id', $liveEvent->id);
});

test('it prioritizes the event with the latest start time when multiple are live', function () {
    // Event A started 30 mins ago (still live within 150 mins window)
    $eventA = Event::factory()->create([
        'title' => 'Event A',
        'event_date' => now(),
        'event_time' => now()->subMinutes(30)->toTimeString(),
        'is_published' => true,
    ]);

    // Event B started 10 mins ago (more recent)
    $eventB = Event::factory()->create([
        'title' => 'Event B',
        'event_date' => now(),
        'event_time' => now()->subMinutes(10)->toTimeString(),
        'is_published' => true,
    ]);

    $response = $this->getJson('/api/v1/events/live');

    $response->assertOk()
        ->assertJsonPath('data.title', 'Event B')
        ->assertJsonPath('data.id', $eventB->id);
});

test('it correctly identifies recurring live event instances', function () {
    // Create a recurring event that instances to today at current time
    // We need to be careful with factories and recurring logic in EventService
    // Ensure the factory sets up enough data for recursion to work
    $parentEvent = Event::factory()->create([
        'title' => 'Weekly Service',
        'event_date' => now()->subWeek()->format('Y-m-d'), // Started last week
        'event_time' => now()->subMinutes(5)->format('H:i:s'), // Same time today
        'is_recurring' => true,
        'recurrence_pattern' => \App\Enums\RecurrencePattern::Weekly,
        'recurrence_interval' => 1,
        'is_published' => true,
        'recurrence_end_date' => now()->addYear(),
    ]);

    $response = $this->getJson('/api/v1/events/live');

    // recurrence expansion logic in EventService needs to work for this test to pass
    // effectively testing integration of Service + Controller

    $response->assertOk()
        ->assertJsonPath('data.title', 'Weekly Service')
        ->assertJsonPath('data.is_recurring_instance', true);
});
