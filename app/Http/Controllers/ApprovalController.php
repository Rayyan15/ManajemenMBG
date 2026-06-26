<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\RawMaterialCatalog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    public function index()
    {
        $movements = InventoryMovement::with(['raw_material_catalog', 'supplier', 'sppg_unit'])
            ->where('type', 'in')
            ->where('approval_status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        $history = InventoryMovement::with(['raw_material_catalog', 'supplier', 'sppg_unit'])
            ->where('type', 'in')
            ->whereIn('approval_status', ['approved', 'rejected'])
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Approval/Index', [
            'movements' => $movements,
            'history' => $history
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $movement = InventoryMovement::findOrFail($id);
        
        if ($movement->approval_status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'PO ini sudah diproses.']);
        }

        $movement->approval_status = $validated['status'];
        $movement->save();

        if ($validated['status'] === 'approved') {
            $material = RawMaterialCatalog::find($movement->raw_material_catalog_id);
            if ($material) {
                $material->current_stock += $movement->quantity;
                $material->save();
            }
            return redirect()->back()->with('success', 'Purchase Order disetujui. Stok telah masuk ke gudang.');
        }

        return redirect()->back()->with('success', 'Purchase Order ditolak.');
    }
}
