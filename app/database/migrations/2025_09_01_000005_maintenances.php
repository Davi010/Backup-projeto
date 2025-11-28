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
        Schema::create('maintenance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained('equipment');
            $table->foreignId('user_id'); 
            $table->string('user_name');
            $table->foreignId('location_id');
            $table->string('location_name');
            $table->text('description')->nullable();
            $table->date('service_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance');
    }
};
