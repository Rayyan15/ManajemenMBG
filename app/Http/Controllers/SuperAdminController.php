<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    public function index()
    {
        $tenants = Tenant::all();
        return Inertia::render('Dashboard/SuperAdmin', [
            'tenants' => $tenants
        ]);
    }

    public function storeTenant(Request $request)
    {
        $request->validate([
            'id' => 'required|string|unique:tenants,id|max:255', // tenant id
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|unique:users,email|max:255',
        ]);

        DB::beginTransaction();
        try {
            // 1. Create the tenant
            // Stancl Tenancy automatically creates the database when a tenant is created.
            $tenant = Tenant::create([
                'id' => $request->id,
            ]);

            // 2. Create the central admin user mapping
            $user = User::create([
                'name' => $request->admin_name,
                'email' => $request->admin_email,
                'password' => Hash::make('password'), // default password
                'role' => 'admin',
                'tenant_id' => $tenant->id,
            ]);

            DB::commit();

            return back()->with('success', 'Yayasan (Tenant) berhasil dibuat dan database telah disiapkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal membuat tenant: ' . $e->getMessage()]);
        }
    }
}
