<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('raw_material_catalog_id')->constrained()->restrictOnDelete();
            $table->string('type')->index();
            $table->integer('quantity');
            $table->string('reference_number')->nullable();
            $table->date('date')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('inventory_movements');
    }
};