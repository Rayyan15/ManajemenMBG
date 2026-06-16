<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('raw_material_catalogs', function (Blueprint $table) {
            $table->string('category')->default('Lainnya')->after('name');
        });
    }
    public function down(): void {
        Schema::table('raw_material_catalogs', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
