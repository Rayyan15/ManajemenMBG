<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class MenuScheduleFactory extends Factory {
    public function definition() {
        return [
            'serving_date' => fake()->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'menu_name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'total_portions' => fake()->numberBetween(50, 500),
        ];
    }
}