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
        Schema::table('raw_material_catalogs', function (Blueprint $table) {
            $table->decimal('estimated_price', 15, 2)->default(0)->after('unit_of_measurement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('raw_material_catalogs', function (Blueprint $table) {
            $table->dropColumn('estimated_price');
        });
    }
};
