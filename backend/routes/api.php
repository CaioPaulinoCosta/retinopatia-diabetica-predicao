<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamResultController;

// Rota pública para verificação de saúde da API
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'Clinic Medical API'
    ]);
});

// Rotas públicas de autenticação (para visitantes)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Rotas protegidas para usuários autenticados (admin ou user)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// Rotas compartilhadas para admin e user - cada um acessa apenas seus próprios dados
Route::middleware(['auth:api', 'role:admin,user'])->group(function () {

    // Dashboard do usuário (mostra apenas dados do próprio usuário)
    Route::get('/dashboard', [AuthController::class, 'me']);

    // Rotas de pacientes - cada usuário gerencia apenas seus pacientes
    Route::apiResource('patients', PatientController::class);

    // Rotas de exames - cada usuário gerencia apenas seus exames
    Route::apiResource('exams', ExamController::class);
    Route::get('/exams/patient/{patientId}', [ExamController::class, 'getByPatient']);

    // Rotas de resultados - cada usuário gerencia apenas seus resultados
    Route::prefix('exam-results')->group(function () {
        Route::apiResource('exams', ExamResultController::class);
        Route::post('/{examId}/analyze', [ExamResultController::class, 'analyzeExam']);
        Route::post('/{examId}/manual', [ExamResultController::class, 'storeManualDiagnosis']);

        // DASHBOARD
        Route::get('/dashboard/distribution', [ExamResultController::class, 'getDiagnosisDistribution']);
        Route::post('/migrate-legacy', [ExamResultController::class, 'migrateLegacyResults']);
    });
});

// Rotas EXCLUSIVAS para administradores (funcionalidades globais)
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AuthController::class, 'me']);
    Route::post('/admin/users', [AuthController::class, 'register']);
});

// Rotas EXCLUSIVAS para usuários comuns (funcionalidades específicas)
Route::middleware(['auth:api', 'role:user'])->group(function () {
    Route::get('/user/dashboard', [AuthController::class, 'me']);
});