<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'event_date' => $this->faker->date(),
            'event_time' => $this->faker->time(),
            'location' => $this->faker->address,
            'event_type' => \App\Enums\EventType::Service,
            'max_attendees' => $this->faker->numberBetween(10, 1000),
            'requires_rsvp' => $this->faker->boolean,
            'is_published' => $this->faker->boolean,
            'is_recurring' => false,
        ];
    }
}
