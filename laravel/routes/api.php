<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamResultController;

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'Clinic Medical API'
    ]);
});

// Rotas de Pacientes
Route::apiResource('patients', PatientController::class);

// Rotas de Exames
Route::apiResource('exams', ExamController::class);
Route::get('/exams/patient/{patientId}', [ExamController::class, 'getByPatient']);

// Rotas de Resultados
Route::prefix('exam-results')->group(function () {
    Route::post('/{examId}/analyze', [ExamResultController::class, 'analyzeExam']);
    Route::post('/{examId}/manual', [ExamResultController::class, 'storeManualDiagnosis']);
    Route::get('/{id}', [ExamResultController::class, 'show']);
    Route::put('/{id}', [ExamResultController::class, 'update']);
    Route::delete('/{id}', [ExamResultController::class, 'destroy']);
});