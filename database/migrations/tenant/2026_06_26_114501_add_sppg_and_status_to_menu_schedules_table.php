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
        Schema::table('menu_schedules', function (Blueprint $table) {
            $table->foreignId('sppg_unit_id')->nullable()->constrained('sppg_units')->onDelete('set null');
            $table->string('batch_number')->nullable();
            $table->string('cooking_status')->default('preparation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_schedules', function (Blueprint $table) {
            $table->dropForeign(['sppg_unit_id']);
            $table->dropColumn(['sppg_unit_id', 'batch_number', 'cooking_status']);
        });
    }
};
