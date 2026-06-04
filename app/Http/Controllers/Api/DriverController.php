<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeliveryLog;

class DriverController extends Controller
{
    public function schedules(Request $request)
    {
        $driverId = $request->user()->id;
        $today = now()->toDateString();

        $schedules = DeliveryLog::with(['menuSchedule', 'partnerSchool'])
            ->where('driver_id', $driverId)
            ->whereDate('delivery_time', $today)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Driver schedules retrieved successfully',
            'data' => $schedules
        ]);
    }
}
