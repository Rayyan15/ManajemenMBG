<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('menu_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_schedule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('raw_material_catalog_id')->constrained()->restrictOnDelete();
            $table->decimal('quantity_per_portion', 8, 2);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('menu_ingredients');
    }
};