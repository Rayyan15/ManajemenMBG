<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\SppgUnit;
use Illuminate\Http\Request;

class SppgUnitController extends Controller
{
    public function index()
    {
        $units = SppgUnit::latest()->get();
        return Inertia::render('Admin/SppgUnits', [
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'capacity' => 'required|integer|min:0',
        ]);

        SppgUnit::create($validated);
        return redirect()->back()->with('message', 'SPPG Unit created successfully.');
    }

    public function update(Request $request, SppgUnit $sppgUnit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'capacity' => 'required|integer|min:0',
        ]);

        $sppgUnit->update($validated);
        return redirect()->back()->with('message', 'SPPG Unit updated successfully.');
    }

    public function destroy(SppgUnit $sppgUnit)
    {
        $sppgUnit->delete();
        return redirect()->back()->with('message', 'SPPG Unit deleted successfully.');
    }
}
