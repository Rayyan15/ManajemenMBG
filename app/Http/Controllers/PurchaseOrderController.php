<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\RawMaterialCatalog;
use App\Http\Requests\StorePurchaseOrderRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PurchaseOrderController extends Controller
{
    public function index(): Response
    {
        // Ambil riwayat stok masuk (Purchase Orders)
        $movements = InventoryMovement::with('raw_material_catalog')
            ->where('type', 'in')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $materials = RawMaterialCatalog::orderBy('name')->get();

        return Inertia::render('Kitchen/StokMasuk', [
            'movements' => $movements,
            'materials' => $materials,
        ]);
    }

    public function store(StorePurchaseOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $material = RawMaterialCatalog::findOrFail($validated['raw_material_catalog_id']);

        $movement = InventoryMovement::create([
            'raw_material_catalog_id' => $material->id,
            'type' => 'in',
            'quantity' => $validated['quantity'],
            'reference_number' => 'PO-' . strtoupper(uniqid()),
            'date' => now()->toDateString(),
            'notes' => 'PO via ' . $validated['vendor_name'] . ($validated['is_taxed'] ? ' (Termasuk PPN)' : '') . '. ' . ($validated['notes'] ?? ''),
            'approval_status' => 'pending', // Menunggu persetujuan Admin
        ]);

        // Catatan: Stok tidak ditambahkan di sini. 
        // Stok akan bertambah ketika Admin menyetujui (Approve) di Dashboard Admin.

        return redirect()->back()->with('success', 'Purchase Order berhasil diajukan dan sedang menunggu persetujuan Admin.');
    }
}
