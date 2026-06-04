<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class PartnerSchoolFactory extends Factory {
    public function definition() {
        return [
            'name' => fake()->company() . ' School',
            'address' => fake()->address(),
            'contact_person' => fake()->name(),
            'phone' => fake()->phoneNumber(),
        ];
    }
}