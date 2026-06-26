<?php

namespace App\Http\Controllers;

use App\Models\SppgUnit;
use App\Models\MenuSchedule;
use App\Http\Requests\StoreMenuScheduleRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class MenuScheduleController extends Controller
{
    public function index(): Response
    {
        $schedules = MenuSchedule::orderBy('serving_date', 'desc')->get();
        $sppgUnits = SppgUnit::all();

        return Inertia::render('Kitchen/MenuSchedule', [
            'schedules' => $schedules,
            'sppgUnits' => $sppgUnits
        ]);
    }

    public function store(StoreMenuScheduleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        MenuSchedule::create([
            'sppg_unit_id' => $validated['sppg_unit_id'],
            'serving_date' => $validated['date'],
            'menu_name' => $validated['menu_name'],
            'description' => $validated['description'] ?? null,
            'total_portions' => $validated['target_portions'],
            'status' => $validated['status'],
            'batch_number' => $validated['batch_number'] ?? null,
            'cooking_status' => $validated['cooking_status'],
        ]);

        broadcast(new \App\Events\SystemUpdated('Kanban Baru dibuat'))->toOthers();

        return redirect()->back()->with('success', 'Jadwal Menu berhasil dibuat.');
    }

    public function updateStatus(\Illuminate\Http\Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'cooking_status' => 'required|in:preparation,cooking,packaging,ready',
        ]);

        $schedule = MenuSchedule::findOrFail($id);
        $schedule->update(['cooking_status' => $validated['cooking_status']]);

        // Jika pindah ke ready, ubah status utama ke completed
        if ($validated['cooking_status'] === 'ready') {
            $schedule->update(['status' => 'completed']);
        }

        broadcast(new \App\Events\SystemUpdated('Status Kanban dipindah'))->toOthers();

        return redirect()->back()->with('success', 'Status Kanban berhasil diperbarui.');
    }
}
