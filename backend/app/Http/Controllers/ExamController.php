<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $patientId = $request->query('patient_id');
            $status = $request->query('status');

            $exams = Exam::with(['patient', 'result'])
                ->whereHas('patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->when($patientId, function ($query, $patientId) use ($user) {
                    return $query->where('patient_id', $patientId)
                        ->whereHas('patient', function ($q) use ($user) {
                            $q->where('user_id', $user->id);
                        });
                })
                ->when($status, function ($query, $status) {
                    return $query->where('status', $status);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $exams,
                'count' => $exams->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar exames: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();

            $validator = Validator::make($request->all(), [
                'patient_id' => 'required|exists:patients,id',
                'exam_type' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
                'exam_date' => 'required|date|before_or_equal:today',
                'notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Verificar se o paciente pertence ao usuário
            $patient = Patient::where('user_id', $user->id)->find($request->patient_id);
            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente não encontrado ou você não tem permissão para acessar este paciente'
                ], Response::HTTP_NOT_FOUND);
            }

            // Upload usando a mesma abordagem que funcionou no Tinker
            if ($request->hasFile('image')) {
                $uploadedFile = $request->file('image');

                // Criar instância do Cloudinary
                $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));

                // Fazer upload
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    ['folder' => 'clinic-exams']
                );

                $imagePath = $uploadResult['secure_url'];
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Imagem do exame é obrigatória'
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $examData = $validator->validated();
            $examData['user_id'] = $user->id;
            $examData['image_path'] = $imagePath;
            $examData['status'] = 'pending';
            unset($examData['image']);

            $exam = Exam::create($examData);

            return response()->json([
                'success' => true,
                'message' => 'Exame criado com sucesso',
                'data' => $exam->load('patient')
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar exame',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $exam = Exam::with(['patient', 'result'])
                ->whereHas('patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($id);

            if (!$exam) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exame não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $exam
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar exame',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $exam = Exam::with(['patient'])
                ->whereHas('patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($id);

            if (!$exam) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exame não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            $validator = Validator::make($request->all(), [
                'exam_type' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'exam_date' => 'sometimes|required|date|before_or_equal:today',
                'status' => 'sometimes|required|in:pending,completed,cancelled',
                'notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $exam->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Exame atualizado com sucesso',
                'data' => $exam->load('patient')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar exame',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $exam = Exam::with(['result'])
                ->whereHas('patient', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->find($id);

            if (!$exam) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exame não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            // Excluir resultado associado se existir
            if ($exam->result) {
                $exam->result->delete();
            }

            // Excluir imagem do storage se existir
            if ($exam->image_path && Storage::exists($exam->image_path)) {
                Storage::delete($exam->image_path);
            }

            $exam->delete();

            return response()->json([
                'success' => true,
                'message' => 'Exame excluído com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir exame',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obter exames por paciente
     */
    public function getByPatient(string $patientId): JsonResponse
    {
        try {
            $user = auth()->user();

            // Verificar se o paciente pertence ao usuário
            $patient = Patient::where('user_id', $user->id)->find($patientId);
            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            $exams = $patient->exams()
                ->with('result')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $exams,
                'patient' => $patient->only(['id', 'name', 'email'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar exames do paciente',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}