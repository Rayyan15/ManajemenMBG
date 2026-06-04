<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('haccp_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_schedule_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('kitchen_manager_id')->nullable();
            $table->date('check_date');
            $table->integer('sanitation_score');
            $table->decimal('storage_temperature', 5, 2);
            $table->integer('cooking_standard_score');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('haccp_checklists');
    }
};