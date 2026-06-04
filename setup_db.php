<?php

$dir = __DIR__;

// 1. UPDATE MIGRATIONS
$migrationsDir = $dir . '/database/migrations';
$migrations = scandir($migrationsDir);

foreach ($migrations as $m) {
    $path = $migrationsDir . '/' . $m;
    if (strpos($m, 'create_users_table') !== false) {
        $content = file_get_contents($path);
        $content = str_replace(
            '$table->string(\'email\')->unique();',
            '$table->string(\'email\')->unique();' . "\n" . '            $table->string(\'role\')->default(\'user\')->index();',
            $content
        );
        $content = str_replace(
            '$table->timestamps();',
            '$table->timestamps();' . "\n" . '            $table->softDeletes();',
            $content
        );
        file_put_contents($path, $content);
    }
    if (strpos($m, 'create_partner_schools_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('partner_schools', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name')->index();
            \$table->text('address');
            \$table->string('contact_person');
            \$table->string('phone');
            \$table->timestamps();
            \$table->softDeletes();
        });
    }
    public function down(): void {
        Schema::dropIfExists('partner_schools');
    }
};");
    }
    if (strpos($m, 'create_attendance_records_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('attendance_records', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('user_id')->constrained()->cascadeOnDelete();
            \$table->foreignId('partner_school_id')->constrained()->cascadeOnDelete();
            \$table->date('date')->index();
            \$table->time('check_in_time');
            \$table->time('check_out_time')->nullable();
            \$table->string('status')->index();
            \$table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('attendance_records');
    }
};");
    }
    if (strpos($m, 'create_raw_material_catalogs_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('raw_material_catalogs', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name')->index();
            \$table->string('sku')->unique();
            \$table->string('unit_of_measurement');
            \$table->integer('current_stock')->default(0);
            \$table->timestamps();
            \$table->softDeletes();
        });
    }
    public function down(): void {
        Schema::dropIfExists('raw_material_catalogs');
    }
};");
    }
    if (strpos($m, 'create_inventory_movements_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('inventory_movements', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('raw_material_catalog_id')->constrained()->restrictOnDelete();
            \$table->string('type')->index();
            \$table->integer('quantity');
            \$table->string('reference_number')->nullable();
            \$table->date('date')->index();
            \$table->text('notes')->nullable();
            \$table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('inventory_movements');
    }
};");
    }
    if (strpos($m, 'create_menu_schedules_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('menu_schedules', function (Blueprint \$table) {
            \$table->id();
            \$table->date('serving_date')->index();
            \$table->string('menu_name');
            \$table->text('description')->nullable();
            \$table->integer('total_portions');
            \$table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('menu_schedules');
    }
};");
    }
    if (strpos($m, 'create_delivery_logs_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('delivery_logs', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('partner_school_id')->constrained()->cascadeOnDelete();
            \$table->foreignId('driver_id')->nullable()->constrained('users')->nullOnDelete();
            \$table->foreignId('menu_schedule_id')->constrained()->cascadeOnDelete();
            \$table->string('status')->index();
            \$table->datetime('delivery_time')->nullable()->index();
            \$table->text('notes')->nullable();
            \$table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('delivery_logs');
    }
};");
    }
    if (strpos($m, 'create_incident_tickets_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('incident_tickets', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('reporter_id')->nullable()->constrained('users')->nullOnDelete();
            \$table->foreignId('partner_school_id')->constrained()->cascadeOnDelete();
            \$table->string('category')->index();
            \$table->string('priority')->index();
            \$table->text('description');
            \$table->string('status')->index();
            \$table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('incident_tickets');
    }
};");
    }
    if (strpos($m, 'create_menu_ingredients_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('menu_ingredients', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('menu_schedule_id')->constrained()->cascadeOnDelete();
            \$table->foreignId('raw_material_catalog_id')->constrained()->restrictOnDelete();
            \$table->decimal('quantity_per_portion', 8, 2);
            \$table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('menu_ingredients');
    }
};");
    }
    if (strpos($m, 'create_haccp_checklists_table') !== false) {
        file_put_contents($path, "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('haccp_checklists', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('menu_schedule_id')->constrained()->cascadeOnDelete();
            \$table->foreignId('kitchen_manager_id')->nullable()->constrained('users')->nullOnDelete();
            \$table->date('check_date');
            \$table->integer('sanitation_score');
            \$table->decimal('storage_temperature', 5, 2);
            \$table->integer('cooking_standard_score');
            \$table->text('notes')->nullable();
            \$table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('haccp_checklists');
    }
};");
    }
}

// 2. UPDATE MODELS FOR SOFTDELETES
$modelsDir = $dir . '/app/Models';
$models = ['User', 'PartnerSchool', 'RawMaterialCatalog'];
foreach ($models as $modelName) {
    $path = $modelsDir . '/' . $modelName . '.php';
    if (file_exists($path)) {
        $content = file_get_contents($path);
        if (strpos($content, 'SoftDeletes') === false) {
            $content = str_replace('use Illuminate\Database\Eloquent\Model;', "use Illuminate\Database\Eloquent\Model;\nuse Illuminate\Database\Eloquent\SoftDeletes;", $content);
            $content = str_replace('use Illuminate\Foundation\Auth\User as Authenticatable;', "use Illuminate\Foundation\Auth\User as Authenticatable;\nuse Illuminate\Database\Eloquent\SoftDeletes;", $content);
            
            // For User class
            if ($modelName === 'User') {
                $content = preg_replace('/use HasFactory, Notifiable;/', "use HasFactory, Notifiable, SoftDeletes;", $content);
            } else {
                $content = preg_replace('/use HasFactory;/', "use HasFactory, SoftDeletes;", $content);
            }
            file_put_contents($path, $content);
        }
    }
}

// 3. FACTORIES
file_put_contents($dir . '/database/factories/PartnerSchoolFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class PartnerSchoolFactory extends Factory {
    public function definition() {
        return [
            'name' => fake()->company() . ' School',
            'address' => fake()->address(),
            'contact_person' => fake()->name(),
            'phone' => fake()->phoneNumber(),
        ];
    }
}");

file_put_contents($dir . '/database/factories/RawMaterialCatalogFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class RawMaterialCatalogFactory extends Factory {
    public function definition() {
        return [
            'name' => fake()->word() . ' Ingredient',
            'sku' => fake()->unique()->numerify('SKU-#####'),
            'unit_of_measurement' => fake()->randomElement(['kg', 'liter', 'pcs']),
            'current_stock' => fake()->numberBetween(10, 1000),
        ];
    }
}");

file_put_contents($dir . '/database/factories/MenuScheduleFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class MenuScheduleFactory extends Factory {
    public function definition() {
        return [
            'serving_date' => fake()->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'menu_name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'total_portions' => fake()->numberBetween(50, 500),
        ];
    }
}");

file_put_contents($dir . '/database/factories/MenuIngredientFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class MenuIngredientFactory extends Factory {
    public function definition() {
        return [
            'menu_schedule_id' => \App\Models\MenuSchedule::factory(),
            'raw_material_catalog_id' => \App\Models\RawMaterialCatalog::factory(),
            'quantity_per_portion' => fake()->randomFloat(2, 0.05, 0.5),
        ];
    }
}");

file_put_contents($dir . '/database/factories/AttendanceRecordFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class AttendanceRecordFactory extends Factory {
    public function definition() {
        return [
            'user_id' => \App\Models\User::factory(),
            'partner_school_id' => \App\Models\PartnerSchool::factory(),
            'date' => fake()->date(),
            'check_in_time' => fake()->time('H:i:s', '08:00:00'),
            'check_out_time' => fake()->time('H:i:s', '16:00:00'),
            'status' => fake()->randomElement(['present', 'absent', 'late']),
        ];
    }
}");

file_put_contents($dir . '/database/factories/InventoryMovementFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class InventoryMovementFactory extends Factory {
    public function definition() {
        return [
            'raw_material_catalog_id' => \App\Models\RawMaterialCatalog::factory(),
            'type' => fake()->randomElement(['in', 'out']),
            'quantity' => fake()->numberBetween(1, 100),
            'reference_number' => fake()->regexify('[A-Z0-9]{8}'),
            'date' => fake()->date(),
            'notes' => fake()->sentence(),
        ];
    }
}");

file_put_contents($dir . '/database/factories/DeliveryLogFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class DeliveryLogFactory extends Factory {
    public function definition() {
        return [
            'partner_school_id' => \App\Models\PartnerSchool::factory(),
            'driver_id' => \App\Models\User::factory(),
            'menu_schedule_id' => \App\Models\MenuSchedule::factory(),
            'status' => fake()->randomElement(['pending', 'in_transit', 'delivered', 'failed']),
            'delivery_time' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'notes' => fake()->sentence(),
        ];
    }
}");

file_put_contents($dir . '/database/factories/IncidentTicketFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class IncidentTicketFactory extends Factory {
    public function definition() {
        return [
            'reporter_id' => \App\Models\User::factory(),
            'partner_school_id' => \App\Models\PartnerSchool::factory(),
            'category' => fake()->randomElement(['logistics', 'food_quality', 'delay']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['open', 'investigating', 'resolved']),
        ];
    }
}");

file_put_contents($dir . '/database/factories/HaccpChecklistFactory.php', "<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class HaccpChecklistFactory extends Factory {
    public function definition() {
        return [
            'menu_schedule_id' => \App\Models\MenuSchedule::factory(),
            'kitchen_manager_id' => \App\Models\User::factory(),
            'check_date' => fake()->date(),
            'sanitation_score' => fake()->numberBetween(60, 100),
            'storage_temperature' => fake()->randomFloat(2, -20, 10),
            'cooking_standard_score' => fake()->numberBetween(60, 100),
            'notes' => fake()->sentence(),
        ];
    }
}");

// 4. DATABASE SEEDER
file_put_contents($dir . '/database/seeders/DatabaseSeeder.php', "<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
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

        // Ensure we create dummy users
        \$users = User::factory(50)->create([
            'role' => fn() => fake()->randomElement(['admin', 'driver', 'teacher', 'kitchen_manager'])
        ]);
        
        \$schools = PartnerSchool::factory(20)->create();
        \$materials = RawMaterialCatalog::factory(50)->create();
        
        // 200 Menu schedules
        \$menus = MenuSchedule::factory(200)->create();
        
        // 200 Menu Ingredients
        foreach(\$menus as \$menu) {
            MenuIngredient::factory()->create([
                'menu_schedule_id' => \$menu->id,
                'raw_material_catalog_id' => \$materials->random()->id
            ]);
        }
        
        // 200 Attendance Records
        for (\$i = 0; \$i < 200; \$i++) {
            AttendanceRecord::factory()->create([
                'user_id' => \$users->random()->id,
                'partner_school_id' => \$schools->random()->id
            ]);
        }
        
        // 100 Inventory Movements
        for (\$i = 0; \$i < 100; \$i++) {
            InventoryMovement::factory()->create([
                'raw_material_catalog_id' => \$materials->random()->id
            ]);
        }
        
        // 100 Delivery logs
        for (\$i = 0; \$i < 100; \$i++) {
            DeliveryLog::factory()->create([
                'partner_school_id' => \$schools->random()->id,
                'driver_id' => \$users->where('role', 'driver')->first()->id ?? \$users->random()->id,
                'menu_schedule_id' => \$menus->random()->id
            ]);
        }
        
        // 50 Incident Tickets
        for (\$i = 0; \$i < 50; \$i++) {
            IncidentTicket::factory()->create([
                'reporter_id' => \$users->random()->id,
                'partner_school_id' => \$schools->random()->id
            ]);
        }
        
        // 50 HACCP Checklists
        for (\$i = 0; \$i < 50; \$i++) {
            HaccpChecklist::factory()->create([
                'menu_schedule_id' => \$menus->random()->id,
                'kitchen_manager_id' => \$users->where('role', 'kitchen_manager')->first()->id ?? \$users->random()->id
            ]);
        }

        Model::reguard();
    }
}");
echo "Setup script completed.";
