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
        
        $schools = PartnerSchool::factory(20)->create();
        $materials = RawMaterialCatalog::factory(50)->create();
        
        // 200 Menu schedules
        $menus = MenuSchedule::factory(200)->create();
        
        // 200 Menu Ingredients
        foreach($menus as $menu) {
            MenuIngredient::factory()->create([
                'menu_schedule_id' => $menu->id,
                'raw_material_catalog_id' => $materials->random()->id
            ]);
        }
        
        // 200 Attendance Records
        for ($i = 0; $i < 200; $i++) {
            AttendanceRecord::factory()->create([
                'user_id' => $users->random()->id,
                'partner_school_id' => $schools->random()->id
            ]);
        }
        
        // 100 Inventory Movements
        for ($i = 0; $i < 100; $i++) {
            InventoryMovement::factory()->create([
                'raw_material_catalog_id' => $materials->random()->id
            ]);
        }
        
        // 100 Delivery logs
        for ($i = 0; $i < 100; $i++) {
            DeliveryLog::factory()->create([
                'partner_school_id' => $schools->random()->id,
                'driver_id' => $users->where('role', 'driver')->first()->id ?? $users->random()->id,
                'menu_schedule_id' => $menus->random()->id
            ]);
        }
        
        // 50 Incident Tickets
        for ($i = 0; $i < 50; $i++) {
            IncidentTicket::factory()->create([
                'reporter_id' => $users->random()->id,
                'partner_school_id' => $schools->random()->id
            ]);
        }
        
        // 50 HACCP Checklists
        for ($i = 0; $i < 50; $i++) {
            HaccpChecklist::factory()->create([
                'menu_schedule_id' => $menus->random()->id,
                'kitchen_manager_id' => $users->where('role', 'kitchen_manager')->first()->id ?? $users->random()->id
            ]);
        }

        Model::reguard();
    }
}