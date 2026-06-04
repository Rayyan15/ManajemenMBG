<?php

namespace App\Services;

use App\Models\InventoryMovement;
use App\Models\SystemSetting;
use Illuminate\Support\Carbon;

class FinanceService
{
    /**
     * Hitung total pengeluaran untuk tanggal tertentu berdasarkan stok yang dipotong.
     *
     * @param string|null $date
     * @return float
     */
    public function calculateDailyExpenditure($date = null): float
    {
        $targetDate = $date ?: now()->toDateString();

        $movements = InventoryMovement::with('rawMaterialCatalog')
            ->where('date', $targetDate)
            ->where('type', 'out')
            ->get();

        $totalCost = 0;
        foreach ($movements as $movement) {
            $material = $movement->rawMaterialCatalog;
            // Anggap quantity dalam unit satuan dasar, kalikan dengan estimated_price
            $totalCost += ($movement->quantity * $material->estimated_price);
        }

        return $totalCost;
    }

    /**
     * Dapatkan target anggaran harian dari pengaturan sistem.
     *
     * @return float
     */
    public function getDailyBudgetTarget(): float
    {
        $setting = SystemSetting::where('key', 'daily_budget_target')->first();
        return $setting ? (float) $setting->value : 0;
    }
}
