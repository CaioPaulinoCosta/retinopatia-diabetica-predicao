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

// Rotas públicas de autenticação
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Rotas protegidas para usuários autenticados (admin ou user)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// Rotas exclusivas para administradores
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AuthController::class, 'me']); // ou outro método específico
    Route::post('/admin/users', [AuthController::class, 'register']); // criar usuários com papel definido

    // Gerenciamento de pacientes
    Route::apiResource('patients', PatientController::class);

    // Gerenciamento de exames
    Route::apiResource('exams', ExamController::class);
    Route::get('/exams/patient/{patientId}', [ExamController::class, 'getByPatient']);

    // Gerenciamento de resultados
    Route::prefix('exam-results')->group(function () {
        Route::get('/', [ExamResultController::class, 'index']);
        Route::post('/{examId}/analyze', [ExamResultController::class, 'analyzeExam']);
        Route::post('/{examId}/manual', [ExamResultController::class, 'storeManualDiagnosis']);
        Route::get('/{id}', [ExamResultController::class, 'show']);
        Route::put('/{id}', [ExamResultController::class, 'update']);
        Route::delete('/{id}', [ExamResultController::class, 'destroy']);
    });
});

// Rotas exclusivas para usuários comuns
Route::middleware(['auth:api', 'role:user'])->group(function () {
    Route::get('/user/dashboard', [AuthController::class, 'me']); // ou outro método específico

    // Acesso limitado a exames e resultados
    Route::get('/exams/patient/{patientId}', [ExamController::class, 'getByPatient']);
    Route::get('/exam-results/{id}', [ExamResultController::class, 'show']);
});

