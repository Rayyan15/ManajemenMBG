<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tenant;
use App\Models\PartnerSchool;
use App\Models\RawMaterialCatalog;
use App\Models\MenuSchedule;
use App\Models\MenuIngredient;
use App\Models\InventoryMovement;
use App\Models\AttendanceRecord;
use App\Models\DeliveryLog;
use App\Models\IncidentTicket;
use App\Models\HaccpChecklist;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder {
    public function run() {
        Model::unguard();

        // 1. Create Super Admin (Sentral)
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@test.com',
            'role' => 'super_admin',
            'tenant_id' => null,
        ]);

        // 2. Create Tenant
        $tenant = Tenant::create(['id' => 'yayasan-demo']);

        // 3. Create Tenant Users (Sentral mapping)
        $admin = User::factory()->create([
            'name' => 'Admin Yayasan',
            'email' => 'admin@test.com',
            'role' => 'admin',
            'tenant_id' => $tenant->id,
        ]);
        
        $driver = User::factory()->create([
            'name' => 'Driver User',
            'email' => 'driver@test.com',
            'role' => 'driver',
            'tenant_id' => $tenant->id,
        ]);
        
        $teacher = User::factory()->create([
            'name' => 'Teacher User',
            'email' => 'teacher@test.com',
            'role' => 'teacher',
            'tenant_id' => $tenant->id,
        ]);
        
        $kitchen = User::factory()->create([
            'name' => 'Kitchen Manager',
            'email' => 'kitchen@test.com',
            'role' => 'kitchen_manager',
            'tenant_id' => $tenant->id,
        ]);

        $users = collect([$admin, $driver, $teacher, $kitchen]);

        // 4. Initialize Tenancy context to run operational seeders
        tenancy()->initialize($tenant);
        
        // Data Dummy Massa telah dibersihkan agar database siap digunakan dari nol (Clean Slate).
        // Anda dapat menambahkan data melalui form UI secara langsung.

        Model::reguard();
    }
}