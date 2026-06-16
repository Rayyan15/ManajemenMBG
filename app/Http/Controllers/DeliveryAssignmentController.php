<?php

namespace App\Http\Controllers;

use App\Models\DeliveryLog;
use App\Models\MenuSchedule;
use App\Models\PartnerSchool;
use App\Models\User;
use App\Http\Requests\StoreDeliveryAssignmentRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DeliveryAssignmentController extends Controller
{
    public function index(): Response
    {
        $assignments = DeliveryLog::with(['driver', 'partner_school', 'menu_schedule'])
            ->orderBy('created_at', 'desc')
            ->get();

        $menus = MenuSchedule::orderBy('serving_date', 'desc')->get();
        $schools = PartnerSchool::orderBy('name')->get();
        $drivers = User::where('role', 'driver')->orderBy('name')->get();

        return Inertia::render('Kitchen/DeliveryAssignment', [
            'assignments' => $assignments,
            'menus' => $menus,
            'schools' => $schools,
            'drivers' => $drivers,
        ]);
    }

    public function store(StoreDeliveryAssignmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['status'] = 'pending'; // Menunggu dijemput kurir

        DeliveryLog::create($validated);

        return redirect()->back()->with('success', 'Jadwal pengiriman berhasil dibuat dan ditugaskan ke kurir.');
    }
}
