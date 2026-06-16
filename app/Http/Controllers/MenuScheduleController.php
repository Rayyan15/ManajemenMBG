<?php

namespace App\Http\Controllers;

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

        return Inertia::render('Kitchen/MenuSchedule', [
            'schedules' => $schedules
        ]);
    }

    public function store(StoreMenuScheduleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        MenuSchedule::create([
            'serving_date' => $validated['date'],
            'menu_name' => $validated['menu_name'],
            'description' => $validated['description'] ?? null,
            'total_portions' => $validated['target_portions'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Jadwal Menu berhasil dibuat.');
    }
}
