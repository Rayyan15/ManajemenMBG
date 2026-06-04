<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class IncidentTicketFactory extends Factory {
    public function definition() {
        return [
            'reporter_id' => \App\Models\User::factory(),
            'partner_school_id' => \App\Models\PartnerSchool::factory(),
            'category' => fake()->randomElement(['logistics', 'food_quality', 'delay']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['open', 'investigating', 'resolved']),
        ];
    }
}