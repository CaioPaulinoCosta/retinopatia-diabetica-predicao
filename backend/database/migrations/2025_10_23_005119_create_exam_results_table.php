<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->string('diagnosis')->nullable();
            $table->decimal('probability_dr', 8, 6)->nullable();
            $table->decimal('probability_no_dr', 8, 6)->nullable();
            $table->integer('class_predicted')->nullable();
            $table->text('recommendation')->nullable();
            $table->text('ml_api_response')->nullable(); // Resposta completa da ML API
            $table->boolean('is_auto_diagnosis')->default(false);
            $table->text('doctor_notes')->nullable();
            $table->timestamp('analyzed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_results');
    }
};