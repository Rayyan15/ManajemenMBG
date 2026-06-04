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
            $table->enum('status', ['planned', 'producing', 'completed'])->default('planned')->after('total_portions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_schedules', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
