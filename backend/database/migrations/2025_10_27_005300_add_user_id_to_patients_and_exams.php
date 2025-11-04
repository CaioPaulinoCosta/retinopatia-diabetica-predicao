<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Patients
        if (Schema::hasTable('patients') && !Schema::hasColumn('patients', 'user_id')) {
            Schema::table('patients', function (Blueprint $table) {
                // use unsignedBigInteger para compatibilidade com ->id()
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
                $table->index('user_id');
            });
        }

        // Exams
        if (Schema::hasTable('exams') && !Schema::hasColumn('exams', 'user_id')) {
            Schema::table('exams', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
                $table->index('user_id');
            });
        }

        // Exam results
        if (Schema::hasTable('exam_results') && !Schema::hasColumn('exam_results', 'user_id')) {
            Schema::table('exam_results', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
                $table->index('user_id');
            });
        }

        // NOTA:
        // Não adicionamos a constraint foreign key aqui para evitar erros se a tabela users
        // ainda não existir ou se tiver um engine/charset diferente. Você pode criar a FK
        // mais tarde numa migration separada quando confirmar que a tabela users existe.
    }

    public function down(): void
    {
        if (Schema::hasTable('exam_results') && Schema::hasColumn('exam_results', 'user_id')) {
            Schema::table('exam_results', function (Blueprint $table) {
                $table->dropIndex(['user_id']);
                $table->dropColumn('user_id');
            });
        }

        if (Schema::hasTable('exams') && Schema::hasColumn('exams', 'user_id')) {
            Schema::table('exams', function (Blueprint $table) {
                $table->dropIndex(['user_id']);
                $table->dropColumn('user_id');
            });
        }

        if (Schema::hasTable('patients') && Schema::hasColumn('patients', 'user_id')) {
            Schema::table('patients', function (Blueprint $table) {
                $table->dropIndex(['user_id']);
                $table->dropColumn('user_id');
            });
        }
    }
};
