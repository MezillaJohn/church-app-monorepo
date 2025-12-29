<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Models\Donation;
use App\Models\DonationType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Donation>
 */
class DonationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Donation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 1000, 100000);

        return [
            'user_id' => User::factory(),
            'amount' => $amount,
            'donation_type_id' => DonationType::inRandomOrder()->first()?->id ?? DonationType::factory(),
            'currency' => 'NGN',
            'amount_in_ngn' => $amount,
            'payment_method' => $this->faker->randomElement(PaymentMethod::cases()),
            'payment_gateway' => 'paystack',
            'transaction_reference' => $this->faker->uuid(),
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'note' => $this->faker->optional()->sentence(),
            'is_anonymous' => $this->faker->boolean(20),
            'proof_of_payment' => null,
        ];
    }
}
