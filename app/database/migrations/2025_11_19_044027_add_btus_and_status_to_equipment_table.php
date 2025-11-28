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
        Schema::table('equipment', function (Blueprint $table) {
            $table->integer('btus')->nullable()->after('quantity');
            $table->enum('status', ['funcionando', 'manutencao', 'defeito', 'desativado'])->default('funcionando')->after('btus');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipment', function (Blueprint $table) {
            $table->dropColumn(['btus', 'status']);
        });
    }
};
