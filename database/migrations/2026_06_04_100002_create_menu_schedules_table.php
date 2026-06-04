<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('menu_schedules', function (Blueprint $table) {
            $table->id();
            $table->date('serving_date')->index();
            $table->string('menu_name');
            $table->text('description')->nullable();
            $table->integer('total_portions');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('menu_schedules');
    }
};