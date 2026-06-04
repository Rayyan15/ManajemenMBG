<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('incident_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('partner_school_id')->constrained()->cascadeOnDelete();
            $table->string('category')->index();
            $table->string('priority')->index();
            $table->text('description');
            $table->string('status')->index();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('incident_tickets');
    }
};