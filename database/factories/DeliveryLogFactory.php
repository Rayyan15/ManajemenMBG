<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class DeliveryLogFactory extends Factory {
    public function definition() {
        return [
            'partner_school_id' => \App\Models\PartnerSchool::factory(),
            'driver_id' => \App\Models\User::factory(),
            'menu_schedule_id' => \App\Models\MenuSchedule::factory(),
            'status' => fake()->randomElement(['pending', 'in_transit', 'delivered', 'failed']),
            'delivery_time' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'notes' => fake()->sentence(),
        ];
    }
}