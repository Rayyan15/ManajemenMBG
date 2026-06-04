<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\IncidentController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json(['status' => 'success', 'data' => $request->user()]);
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Rute Khusus Kurir
    Route::middleware('role:driver')->group(function () {
        Route::get('/driver/schedules', [DriverController::class, 'schedules']);
    });

    // Rute Laporan Insiden
    Route::post('/incidents', [IncidentController::class, 'store']);
});
