<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\IncidentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Dasbor Super Admin (Sentral - Tanpa Tenant)
    Route::middleware('role:super_admin')->group(function () {
        Route::get('/super/dashboard', [\App\Http\Controllers\SuperAdminController::class, 'index'])->name('super.dashboard');
        Route::post('/super/tenants', [\App\Http\Controllers\SuperAdminController::class, 'storeTenant'])->name('super.tenants.store');
    });

    // Rute Operasional (Membutuhkan akses Tenant)
    Route::middleware('tenant.auth')->group(function () {
        // Dasbor Pemilik Yayasan
        Route::middleware('role:admin')->group(function () {
            Route::get('/admin/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
            Route::post('/admin/incidents/{id}/status', [IncidentController::class, 'updateStatusWeb'])->name('admin.incidents.updateStatus');
            Route::resource('admin/schools', \App\Http\Controllers\SchoolController::class)->names('admin.schools');
            Route::resource('admin/users', \App\Http\Controllers\UserController::class)->names('admin.users');
            Route::resource('admin/approvals', \App\Http\Controllers\ApprovalController::class)->names('admin.approvals');
            Route::resource('admin/sppg-units', \App\Http\Controllers\SppgUnitController::class)->names('admin.sppg-units');
            Route::resource('admin/suppliers', \App\Http\Controllers\SupplierController::class)->names('admin.suppliers');
        });

        // Dasbor Manajer Dapur
        Route::middleware('role:kitchen_manager')->group(function () {
            Route::get('/kitchen/dashboard', [DashboardController::class, 'kitchen'])->name('kitchen.dashboard');
            Route::resource('kitchen/schedules', \App\Http\Controllers\MenuScheduleController::class)->names('kitchen.schedules');
            Route::patch('/kitchen/schedules/{id}/status', [\App\Http\Controllers\MenuScheduleController::class, 'updateStatus'])->name('kitchen.schedules.updateStatus');
            Route::resource('kitchen/inventory', \App\Http\Controllers\InventoryController::class)->names('kitchen.inventory');
            Route::resource('kitchen/stok-masuk', \App\Http\Controllers\PurchaseOrderController::class)->names('kitchen.stok-masuk');
            Route::post('/kitchen/materials', [\App\Http\Controllers\PurchaseOrderController::class, 'storeMaterial'])->name('kitchen.materials.store');
            Route::resource('kitchen/assignments', \App\Http\Controllers\DeliveryAssignmentController::class)->names('kitchen.assignments');
            Route::post('/kitchen/haccp', [\App\Http\Controllers\Api\KitchenController::class, 'storeHaccp'])->name('kitchen.haccp');
            Route::post('/kitchen/produce', [\App\Http\Controllers\Api\KitchenController::class, 'produce'])->name('kitchen.produce');
        });

        // PWA Kurir
        Route::middleware('role:driver')->group(function () {
            Route::get('/driver/dashboard', [DashboardController::class, 'driver'])->name('driver.dashboard');
            Route::post('/driver/update-status/{id}', [DashboardController::class, 'updateDriverStatus'])->name('driver.updateStatus');
        });

        // PWA Sekolah (Menggunakan role teacher)
        Route::middleware('role:teacher')->group(function () {
            Route::get('/school/dashboard', [DashboardController::class, 'school'])->name('school.dashboard');
            Route::post('/school/confirm-receipt/{id}', [DashboardController::class, 'confirmReceipt'])->name('school.confirmReceipt');
        });

        // Web Route untuk Insiden dari PWA
        Route::post('/incidents', [IncidentController::class, 'storeWeb'])->name('incidents.store');
    });
});


require __DIR__.'/auth.php';
