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
     * Classificar diagnóstico baseado nas probabilidades (PARA DASHBOARD)
     */
    private function classifyDiagnosisForDashboard(float $probabilityDr, float $probabilityNoDr): string
    {
        $confidence = abs($probabilityDr - $probabilityNoDr);

        // Se a probabilidade de não ter DR for muito alta
        if ($probabilityNoDr >= 0.95) {
            return 'no_dr';
        }

        // Classificação baseada na confiança e probabilidade
        if ($probabilityDr >= 0.8) {
            if ($confidence >= 0.7) {
                return 'proliferate';
            } elseif ($confidence >= 0.5) {
                return 'severe';
            } elseif ($confidence >= 0.3) {
                return 'moderate';
            } else {
                return 'mild';
            }
        }

        if ($probabilityDr >= 0.6) {
            return 'moderate';
        }

        if ($probabilityDr >= 0.4) {
            return 'mild';
        }

        return 'no_dr';
    }

    /**
     * Determinar diagnóstico binário (COMPATÍVEL COM FRONTEND ATUAL)
     */
    private function getBinaryDiagnosis(float $probabilityDr, float $probabilityNoDr): string
    {
        return $probabilityDr >= 0.5 ? 'DR' : 'No_DR';
    }

    /**
     * Enviar exame para análise da ML API (MANTIDO COMPATÍVEL)
     */
    public function analyzeExam(Request $request, string $examId): JsonResponse
    {
        try {
            $user = auth()->user();
            $exam = Exam::with('patient')
                ->whereHas('patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($examId);

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

            // Manter compatibilidade com frontend atual (diagnóstico binário)
            $probabilityDr = floatval($analysisResult['probability_dr'] ?? 0);
            $probabilityNoDr = floatval($analysisResult['probability_no_dr'] ?? 0);

            $binaryDiagnosis = $this->getBinaryDiagnosis($probabilityDr, $probabilityNoDr);
            $detailedDiagnosis = $this->classifyDiagnosisForDashboard($probabilityDr, $probabilityNoDr);

            // Criar resultado do exame (mantendo campos atuais)
            $examResult = ExamResult::create([
                'exam_id' => $exam->id,
                'diagnosis' => $binaryDiagnosis, // Mantém DR/No_DR para frontend
                'detailed_diagnosis' => $detailedDiagnosis, // Novo campo para dashboard
                'probability_dr' => $probabilityDr,
                'probability_no_dr' => $probabilityNoDr,
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
                    // Não inclui detailed_diagnosis na resposta para manter compatibilidade
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

    /**
     * Endpoint ESPECÍFICO para dashboard - Distribuição de diagnósticos
     */
    public function getDiagnosisDistribution(): JsonResponse
    {
        try {
            $user = auth()->user();

            // Buscar todos os resultados com detailed_diagnosis
            $results = ExamResult::with(['exam.patient'])
                ->whereHas('exam.patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->whereNotNull('detailed_diagnosis')
                ->get();

            // Contar por tipo detalhado
            $distribution = [
                'no_dr' => 0,
                'mild' => 0,
                'moderate' => 0,
                'severe' => 0,
                'proliferate' => 0
            ];

            foreach ($results as $result) {
                if (isset($distribution[$result->detailed_diagnosis])) {
                    $distribution[$result->detailed_diagnosis]++;
                }
            }

            // Para exames antigos sem detailed_diagnosis, usar o diagnóstico binário
            $legacyResults = ExamResult::with(['exam.patient'])
                ->whereHas('exam.patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->whereNull('detailed_diagnosis')
                ->get();

            foreach ($legacyResults as $result) {
                if ($result->diagnosis === 'No_DR') {
                    $distribution['no_dr']++;
                } else {
                    // Distribuir DR genérico entre os tipos (você pode ajustar essa lógica)
                    $distribution['mild']++;
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'distribution' => $distribution,
                    'total_exams' => $results->count() + $legacyResults->count(),
                    'labels' => [
                        'no_dr' => 'Sem Retinopatia',
                        'mild' => 'Leve',
                        'moderate' => 'Moderada',
                        'severe' => 'Severa',
                        'proliferate' => 'Proliferativa'
                    ]
                ],
                'message' => 'Distribuição de diagnósticos recuperada com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao recuperar distribuição de diagnósticos: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Migrar resultados antigos para o novo formato
     */
    public function migrateLegacyResults(): JsonResponse
    {
        try {
            $user = auth()->user();

            $legacyResults = ExamResult::with(['exam.patient'])
                ->whereHas('exam.patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->whereNull('detailed_diagnosis')
                ->get();

            $migrated = 0;

            foreach ($legacyResults as $result) {
                $probabilityDr = floatval($result->probability_dr ?? 0);
                $probabilityNoDr = floatval($result->probability_no_dr ?? 0);

                $detailedDiagnosis = $this->classifyDiagnosisForDashboard($probabilityDr, $probabilityNoDr);

                $result->update([
                    'detailed_diagnosis' => $detailedDiagnosis
                ]);

                $migrated++;
            }

            return response()->json([
                'success' => true,
                'message' => "{$migrated} resultados migrados com sucesso",
                'data' => [
                    'migrated_count' => $migrated
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao migrar resultados: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();
            $examResults = ExamResult::with(['exam.patient'])
                ->whereHas('exam.patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
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
                'message' => 'Failed to retrieve exam results: ' . $e->getMessage(),
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
            $user = auth()->user();
            $exam = Exam::with('patient')
                ->whereHas('patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($examId);

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
                'user_id' => $user->id,
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
            $user = auth()->user();
            $examResult = ExamResult::with('exam.patient')
                ->whereHas('exam.patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($id);

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
            $user = auth()->user();
            $examResult = ExamResult::with(['exam', 'exam.patient'])
                ->whereHas('exam.patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($id);

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
            $user = auth()->user();
            $examResult = ExamResult::with('exam')
                ->whereHas('exam.patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($id);

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