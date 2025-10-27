<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class ExamResultController extends Controller
{
    /**
     * Enviar exame para análise da ML API
     */
    public function analyzeExam(Request $request, string $examId): JsonResponse
    {
        try {
            $exam = Exam::with('patient')->find($examId);

            if (!$exam) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exame não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            if ($exam->result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este exame já possui resultado'
                ], Response::HTTP_CONFLICT);
            }

            if (!$exam->image_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exame não possui imagem para análise'
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Baixar a imagem do Cloudinary temporariamente
            $tempImage = tempnam(sys_get_temp_dir(), 'exam_') . '.png';
            $imageContent = file_get_contents($exam->image_path);
            file_put_contents($tempImage, $imageContent);

            // Chamar a ML API com upload de arquivo
            $mlApiUrl = config('app.ml_api_url', 'http://ml-api:8000');

            $response = Http::timeout(60)
                ->attach('image', file_get_contents($tempImage), 'exam_image.png')
                ->post("{$mlApiUrl}/predict");

            // Limpar arquivo temporário
            unlink($tempImage);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro ao conectar com a API de análise',
                    'error' => $response->body()
                ], Response::HTTP_SERVICE_UNAVAILABLE);
            }

            $analysisResult = $response->json();

            // Criar resultado do exame
            $examResult = ExamResult::create([
                'exam_id' => $exam->id,
                'diagnosis' => $analysisResult['diagnosis'] ?? null,
                'probability_dr' => $analysisResult['probability_dr'] ?? null,
                'probability_no_dr' => $analysisResult['probability_no_dr'] ?? null,
                'class_predicted' => $analysisResult['class_predicted'] ?? null,
                'recommendation' => $analysisResult['recommendation'] ?? null,
                'ml_api_response' => json_encode($analysisResult),
                'is_auto_diagnosis' => true,
                'analyzed_at' => now()
            ]);

            // Atualizar status do exame
            $exam->update(['status' => 'completed']);

            return response()->json([
                'success' => true,
                'message' => 'Análise concluída com sucesso',
                'data' => [
                    'exam' => $exam->load('patient'),
                    'result' => $examResult
                ]
            ]);
        } catch (\Exception $e) {
            // Limpar arquivo temporário em caso de erro
            if (isset($tempImage) && file_exists($tempImage)) {
                unlink($tempImage);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erro ao analisar exame',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function index(): JsonResponse
    {
        try {
            $examResults = ExamResult::with(['exam.patient'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $examResults,
                'message' => 'Exam results retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve exam results',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Adicionar diagnóstico manual
     */
    public function storeManualDiagnosis(Request $request, string $examId): JsonResponse
    {
        try {
            $exam = Exam::with('patient')->find($examId);

            if (!$exam) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exame não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            // Verificar se já existe resultado
            if ($exam->result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este exame já possui resultado'
                ], Response::HTTP_CONFLICT);
            }

            $validator = Validator::make($request->all(), [
                'diagnosis' => 'required|string|max:255',
                'probability_dr' => 'nullable|numeric|between:0,1',
                'probability_no_dr' => 'nullable|numeric|between:0,1',
                'class_predicted' => 'nullable|integer',
                'recommendation' => 'required|string',
                'doctor_notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $examResult = ExamResult::create([
                'exam_id' => $exam->id,
                'diagnosis' => $request->diagnosis,
                'probability_dr' => $request->probability_dr,
                'probability_no_dr' => $request->probability_no_dr,
                'class_predicted' => $request->class_predicted,
                'recommendation' => $request->recommendation,
                'doctor_notes' => $request->doctor_notes,
                'is_auto_diagnosis' => false,
                'analyzed_at' => now()
            ]);

            // Atualizar status do exame
            $exam->update(['status' => 'completed']);

            return response()->json([
                'success' => true,
                'message' => 'Diagnóstico manual adicionado com sucesso',
                'data' => [
                    'exam' => $exam->load('patient'),
                    'result' => $examResult
                ]
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao adicionar diagnóstico manual',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Atualizar resultado do exame
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $examResult = ExamResult::with('exam.patient')->find($id);

            if (!$examResult) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resultado não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            $validator = Validator::make($request->all(), [
                'diagnosis' => 'sometimes|required|string|max:255',
                'probability_dr' => 'nullable|numeric|between:0,1',
                'probability_no_dr' => 'nullable|numeric|between:0,1',
                'class_predicted' => 'nullable|integer',
                'recommendation' => 'sometimes|required|string',
                'doctor_notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $examResult->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Resultado atualizado com sucesso',
                'data' => $examResult->load('exam.patient')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar resultado',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Exibir resultado do exame
     */
    public function show(string $id): JsonResponse
    {
        try {
            $examResult = ExamResult::with(['exam', 'exam.patient'])->find($id);

            if (!$examResult) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resultado não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $examResult
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar resultado',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Excluir resultado do exame
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $examResult = ExamResult::find($id);

            if (!$examResult) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resultado não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            // Reverter status do exame para pending
            $examResult->exam->update(['status' => 'pending']);

            $examResult->delete();

            return response()->json([
                'success' => true,
                'message' => 'Resultado excluído com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir resultado',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}