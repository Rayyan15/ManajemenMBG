<?php

namespace App\Http\Controllers;

use App\Models\RawMaterialCatalog;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $materials = RawMaterialCatalog::orderBy('category')->get();

        // Mengelompokkan berdasarkan kategori untuk chips filter di React
        $categories = ['Semua', 'Karbohidrat', 'Protein Hewani', 'Protein Nabati', 'Sayuran', 'Bumbu', 'Lainnya'];

        return Inertia::render('Kitchen/Inventaris', [
            'materials' => $materials,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'sku' => 'required|string|unique:raw_material_catalogs,sku',
            'unit_of_measurement' => 'required|string',
            'current_stock' => 'required|numeric|min:0',
        ]);

        $material = RawMaterialCatalog::create($validated);

        // Jika ada stok awal, catat sebagai Inventory Movement
        if ($material->current_stock > 0) {
            InventoryMovement::create([
                'raw_material_catalog_id' => $material->id,
                'type' => 'in',
                'quantity' => $material->current_stock,
                'reference_number' => 'INIT-' . strtoupper(uniqid()),
                'date' => now()->toDateString(),
                'notes' => 'Stok awal',
            ]);
        }

        return redirect()->back()->with('success', 'Bahan baku berhasil ditambahkan.');
    }
}
