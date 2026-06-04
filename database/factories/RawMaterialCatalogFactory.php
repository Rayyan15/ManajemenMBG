<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class RawMaterialCatalogFactory extends Factory {
    public function definition() {
        return [
            'name' => fake()->word() . ' Ingredient',
            'sku' => fake()->unique()->numerify('SKU-#####'),
            'unit_of_measurement' => fake()->randomElement(['kg', 'liter', 'pcs']),
            'current_stock' => fake()->numberBetween(10, 1000),
        ];
    }
}