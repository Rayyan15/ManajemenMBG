<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class HaccpChecklistFactory extends Factory {
    public function definition() {
        return [
            'menu_schedule_id' => \App\Models\MenuSchedule::factory(),
            'kitchen_manager_id' => \App\Models\User::factory(),
            'check_date' => fake()->date(),
            'sanitation_score' => fake()->numberBetween(60, 100),
            'storage_temperature' => fake()->randomFloat(2, -20, 10),
            'cooking_standard_score' => fake()->numberBetween(60, 100),
            'notes' => fake()->sentence(),
        ];
    }
}