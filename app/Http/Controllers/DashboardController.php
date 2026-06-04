<?php

namespace App\Http\Controllers;

use App\Models\MenuSchedule;
use App\Models\DeliveryLog;
use App\Models\RawMaterialCatalog;
use App\Events\DeliveryStatusUpdated;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->user()->role;
        
        if ($role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($role === 'kitchen_manager') {
            return redirect()->route('kitchen.dashboard');
        } elseif ($role === 'driver') {
            return redirect()->route('driver.dashboard');
        } elseif ($role === 'teacher') {
            return redirect()->route('school.dashboard');
        }

        return Inertia::render('Dashboard');
    }

    public function admin()
    {
        $today = now()->toDateString();

        $dailyPortions = MenuSchedule::where('serving_date', $today)->sum('total_portions');

        $deliveredSchedules = DeliveryLog::where('status', 'delivered')
                                ->whereDate('delivery_time', $today)
                                ->pluck('menu_schedule_id');
        
        $deliveredPortions = MenuSchedule::whereIn('id', $deliveredSchedules)->sum('total_portions');

        $lowStockMaterials = RawMaterialCatalog::where('current_stock', '<', 50)->get(['name', 'current_stock', 'unit_of_measurement']);

        $recentIncidents = \App\Models\IncidentTicket::with(['partnerSchool', 'reporter'])->orderBy('created_at', 'desc')->take(5)->get();

        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            
            $target = MenuSchedule::where('serving_date', $date)->sum('total_portions');
            
            $deliveredIds = DeliveryLog::where('status', 'delivered')
                                ->whereDate('delivery_time', $date)
                                ->pluck('menu_schedule_id');
            $actual = MenuSchedule::whereIn('id', $deliveredIds)->sum('total_portions');

            $chartData[] = [
                'date' => now()->subDays($i)->format('d M'),
                'target' => (int) $target,
                'actual' => (int) $actual,
            ];
        }

        return Inertia::render('Dashboard/Admin', [
            'metrics' => [
                'dailyPortions' => (int) $dailyPortions,
                'deliveredPortions' => (int) $deliveredPortions,
                'lowStockAlerts' => $lowStockMaterials,
                'recentIncidents' => $recentIncidents
            ],
            'chartData' => $chartData
        ]);
    }

    public function driver(Request $request)
    {
        $today = now()->toDateString();
        $schedules = DeliveryLog::with(['menuSchedule', 'partnerSchool'])
            ->where('driver_id', $request->user()->id)
            ->whereDate('delivery_time', $today)
            ->get();

        $incidents = \App\Models\IncidentTicket::where('reporter_id', $request->user()->id)
            ->whereDate('created_at', $today)
            ->get();

        return Inertia::render('Dashboard/Driver', [
            'schedules' => $schedules,
            'incidents' => $incidents
        ]);
    }

    public function updateDriverStatus(Request $request, $id)
    {
        $log = DeliveryLog::findOrFail($id);
        
        $status = $request->input('status');
        
        if ($status === 'delivered') {
            $request->validate([
                'proof_image' => 'nullable|image|max:5120' // Maks 5MB
            ]);

            if ($request->hasFile('proof_image')) {
                $path = $request->file('proof_image')->store('delivery_proofs', 'public');
                $log->proof_image_path = $path;
            }
        }

        $log->update(['status' => $status]);

        // Jika selesai terkirim, kita pancarkan kejadian ke Admin
        if ($status === 'delivered') {
            broadcast(new \App\Events\DeliveryStatusUpdated())->toOthers();
        }

        return back()->with('success', 'Status pengiriman diperbarui');
    }

    public function school(Request $request)
    {
        $today = now()->toDateString();
        $deliveries = DeliveryLog::with(['menuSchedule'])
            ->where('partner_school_id', $request->user()->partner_school_id)
            ->whereDate('delivery_time', $today)
            ->get();

        return Inertia::render('Dashboard/School', [
            'deliveries' => $deliveries
        ]);
    }

    public function confirmReceipt(Request $request, $id)
    {
        $log = DeliveryLog::findOrFail($id);
        $log->update(['status' => 'delivered']);

        // Broadcast Event
        broadcast(new DeliveryStatusUpdated())->toOthers();

        return back();
    }
}
