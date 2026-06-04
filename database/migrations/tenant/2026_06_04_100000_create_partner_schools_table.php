<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('partner_schools', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->text('address');
            $table->string('contact_person');
            $table->string('phone');
            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void {
        Schema::dropIfExists('partner_schools');
    }
};