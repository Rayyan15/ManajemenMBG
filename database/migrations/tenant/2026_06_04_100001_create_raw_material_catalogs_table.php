<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('raw_material_catalogs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('sku')->unique();
            $table->string('unit_of_measurement');
            $table->integer('current_stock')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void {
        Schema::dropIfExists('raw_material_catalogs');
    }
};