<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('exam_results', function (Blueprint $table) {
            $table->enum('detailed_diagnosis', [
                'no_dr',
                'mild',
                'moderate',
                'severe',
                'proliferate'
            ])->nullable()->after('diagnosis');
        });
    }

    public function down(): void
    {
        Schema::table('exam_results', function (Blueprint $table) {
            $table->dropColumn('detailed_diagnosis');
        });
    }
};