<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('partner_school_id')->constrained()->cascadeOnDelete();
            $table->date('date')->index();
            $table->time('check_in_time');
            $table->time('check_out_time')->nullable();
            $table->string('status')->index();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('attendance_records');
    }
};