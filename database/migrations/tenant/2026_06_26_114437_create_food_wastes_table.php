<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('food_wastes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sppg_unit_id')->nullable()->constrained('sppg_units')->onDelete('cascade');
            $table->foreignId('partner_school_id')->nullable()->constrained('partner_schools')->onDelete('cascade');
            $table->foreignId('menu_schedule_id')->nullable()->constrained('menu_schedules')->onDelete('cascade');
            $table->integer('waste_portions')->default(0);
            $table->decimal('waste_weight_kg', 8, 2)->default(0);
            $table->date('date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_wastes');
    }
};
