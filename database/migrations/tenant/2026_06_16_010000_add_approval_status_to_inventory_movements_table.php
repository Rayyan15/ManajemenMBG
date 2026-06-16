<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->string('approval_status')->default('approved')->after('notes');
        });
    }
    public function down(): void {
        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->dropColumn('approval_status');
        });
    }
};
