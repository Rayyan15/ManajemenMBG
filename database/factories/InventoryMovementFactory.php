<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class InventoryMovementFactory extends Factory {
    public function definition() {
        return [
            'raw_material_catalog_id' => \App\Models\RawMaterialCatalog::factory(),
            'type' => fake()->randomElement(['in', 'out']),
            'quantity' => fake()->numberBetween(1, 100),
            'reference_number' => fake()->regexify('[A-Z0-9]{8}'),
            'date' => fake()->date(),
            'notes' => fake()->sentence(),
        ];
    }
}