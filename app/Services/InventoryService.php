<?php

namespace App\Services;

use App\Models\MenuSchedule;
use App\Models\InventoryMovement;
use App\Models\RawMaterialCatalog;
use Illuminate\Support\Facades\DB;
use Exception;

class InventoryService
{
    /**
     * Deduct inventory automatically based on the menu schedule's production requirements.
     *
     * @param MenuSchedule $menu
     * @return void
     * @throws Exception
     */
    public function deductStockForProduction(MenuSchedule $menu): void
    {
        DB::beginTransaction();

        try {
            foreach ($menu->menuIngredients as $ingredient) {
                $material = $ingredient->rawMaterialCatalog;
                $totalRequired = $ingredient->quantity_per_portion * $menu->total_portions;

                if ($material->current_stock < $totalRequired) {
                    throw new Exception("Insufficient stock for {$material->name}. Required: {$totalRequired}, Available: {$material->current_stock}");
                }

                // Deduct stock
                $material->decrement('current_stock', $totalRequired);

                // Record movement
                InventoryMovement::create([
                    'raw_material_catalog_id' => $material->id,
                    'type' => 'out',
                    'quantity' => $totalRequired,
                    'reference_number' => 'PROD-MENU-' . $menu->id,
                    'date' => now()->toDateString(),
                    'notes' => "Automatic deduction for production: {$menu->menu_name}",
                ]);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
