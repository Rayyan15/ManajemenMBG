<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class AttendanceRecordFactory extends Factory {
    public function definition() {
        return [
            'user_id' => \App\Models\User::factory(),
            'partner_school_id' => \App\Models\PartnerSchool::factory(),
            'date' => fake()->date(),
            'check_in_time' => fake()->time('H:i:s', '08:00:00'),
            'check_out_time' => fake()->time('H:i:s', '16:00:00'),
            'status' => fake()->randomElement(['present', 'absent', 'late']),
        ];
    }
}