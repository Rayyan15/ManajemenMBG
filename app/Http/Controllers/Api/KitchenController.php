<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HaccpChecklist;
use App\Models\MenuSchedule;
use App\Models\InventoryMovement;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;

class KitchenController extends Controller
{
    public function storeHaccp(Request $request)
    {
        $validated = $request->validate([
            'menu_schedule_id' => 'required|exists:menu_schedules,id',
            'sanitation_score' => 'required|integer|min:0|max:100',
            'storage_temperature' => 'required|numeric',
            'cooking_standard_score' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string'
        ]);

        $validated['kitchen_manager_id'] = auth()->id();
        $validated['check_date'] = now()->toDateString();

        HaccpChecklist::updateOrCreate(
            ['menu_schedule_id' => $validated['menu_schedule_id']],
            $validated
        );

        return back()->with('success', 'Formulir HACCP berhasil disimpan.');
    }

    public function produce(Request $request, InventoryService $inventoryService)
    {
        $request->validate(['menu_schedule_id' => 'required|exists:menu_schedules,id']);
        
        $menu = MenuSchedule::findOrFail($request->menu_schedule_id);

        // Prevent double production
        if ($menu->status === 'completed' || $menu->status === 'producing') {
            return back()->withErrors(['error' => 'Menu ini sudah atau sedang diproduksi.']);
        }

        $existingMovement = InventoryMovement::where('reference_number', 'PROD-MENU-' . $menu->id)->first();
        if ($existingMovement) {
            return back()->withErrors(['error' => 'Pemotongan stok untuk menu ini sudah pernah dilakukan.']);
        }

        try {
            $menu->update(['status' => 'producing']);
            $inventoryService->deductStockForProduction($menu);
            $menu->update(['status' => 'completed']);
            
            return back()->with('success', 'Produksi berhasil dimulai dan stok telah dipotong secara otomatis.');
        } catch (Exception $e) {
            $menu->update(['status' => 'planned']);
            return back()->withErrors(['error' => 'Gagal memotong stok: ' . $e->getMessage()]);
        }
    }
}
