<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('exam_results', function (Blueprint $table) {
            $table->string('diagnosis_severity')->nullable()->after('diagnosis');
            $table->decimal('confidence', 3, 2)->nullable()->after('probability_no_dr');
            $table->string('diagnosis')->change(); // Alterar para string para armazenar os novos valores
        });
    }

    public function down(): void
    {
        Schema::table('exam_results', function (Blueprint $table) {
            $table->dropColumn(['diagnosis_severity', 'confidence']);
        });
    }
};