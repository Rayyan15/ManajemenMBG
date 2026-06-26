<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\RawMaterialCatalog;
use App\Models\Supplier;
use App\Models\SppgUnit;
use App\Http\Requests\StorePurchaseOrderRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PurchaseOrderController extends Controller
{
    public function index(): Response
    {
        $movements = InventoryMovement::with(['raw_material_catalog', 'supplier'])
            ->where('type', 'in')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $materials = RawMaterialCatalog::orderBy('name')->get();
        $suppliers = Supplier::orderBy('name')->get();
        $sppgUnits = SppgUnit::orderBy('name')->get();

        return Inertia::render('Kitchen/StokMasuk', [
            'movements' => $movements,
            'materials' => $materials,
            'suppliers' => $suppliers,
            'sppgUnits' => $sppgUnits,
        ]);
    }

    public function store(StorePurchaseOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $material = RawMaterialCatalog::findOrFail($validated['raw_material_catalog_id']);
        
        $totalPrice = $validated['quantity'] * $validated['unit_price'];
        if ($validated['is_taxed']) {
            $totalPrice = $totalPrice * 1.11; // 11% PPN
        }

        InventoryMovement::create([
            'sppg_unit_id' => $validated['sppg_unit_id'],
            'supplier_id' => $validated['supplier_id'],
            'raw_material_catalog_id' => $material->id,
            'type' => 'in',
            'quantity' => $validated['quantity'],
            'unit_price' => $validated['unit_price'],
            'total_price' => $totalPrice,
            'reference_number' => 'PO-' . strtoupper(uniqid()),
            'date' => now()->toDateString(),
            'notes' => 'PO diajukan. ' . ($validated['notes'] ?? ''),
            'approval_status' => 'pending',
        ]);

        broadcast(new \App\Events\SystemUpdated('PO Baru dibuat'))->toOthers();

        return redirect()->back()->with('success', 'Purchase Order berhasil diajukan dan sedang menunggu persetujuan Admin.');
    }

    public function storeMaterial(\Illuminate\Http\Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50',
            'unit_of_measurement' => 'required|string|max:50',
        ]);

        if (empty($validated['sku'])) {
            $validated['sku'] = strtoupper(substr(uniqid(), -5));
        }

        RawMaterialCatalog::create([
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'unit_of_measurement' => $validated['unit_of_measurement'],
            'current_stock' => 0,
        ]);

        return redirect()->back()->with('success', 'Bahan baku baru berhasil ditambahkan.');
    }
}
