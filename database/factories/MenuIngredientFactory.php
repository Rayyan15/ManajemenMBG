<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class MenuIngredientFactory extends Factory {
    public function definition() {
        return [
            'menu_schedule_id' => \App\Models\MenuSchedule::factory(),
            'raw_material_catalog_id' => \App\Models\RawMaterialCatalog::factory(),
            'quantity_per_portion' => fake()->randomFloat(2, 0.05, 0.5),
        ];
    }
}