<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search');
            $hasDiabetes = $request->query('has_diabetes');

            $patients = Patient::when($search, function ($query, $search) {
                return $query->search($search);
            })
                ->when($hasDiabetes !== null, function ($query) use ($hasDiabetes) {
                    return $query->where('has_diabetes', filter_var($hasDiabetes, FILTER_VALIDATE_BOOLEAN));
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $patients,
                'count' => $patients->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar pacientes',
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
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:patients,email',
                'phone' => 'nullable|string|max:20',
                'birth_date' => 'required|date|before:today',
                'gender' => 'required|in:male,female,other',
                'address' => 'nullable|string',
                'emergency_contact' => 'nullable|string|max:255',
                'medical_history' => 'nullable|string',
                'allergies' => 'nullable|string',
                'current_medications' => 'nullable|string',
                'insurance_provider' => 'nullable|string|max:255',
                'insurance_number' => 'nullable|string|max:255',
                'has_diabetes' => 'boolean',
                'additional_notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $patient = Patient::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Paciente criado com sucesso',
                'data' => $patient
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar paciente',
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
            $patient = Patient::with(['exams', 'exams.result'])->find($id);

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $patient
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar paciente',
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
            $patient = Patient::find($id);

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:patients,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'birth_date' => 'sometimes|required|date|before:today',
                'gender' => 'sometimes|required|in:male,female,other',
                'address' => 'nullable|string',
                'emergency_contact' => 'nullable|string|max:255',
                'medical_history' => 'nullable|string',
                'allergies' => 'nullable|string',
                'current_medications' => 'nullable|string',
                'insurance_provider' => 'nullable|string|max:255',
                'insurance_number' => 'nullable|string|max:255',
                'has_diabetes' => 'boolean',
                'additional_notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $patient->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Paciente atualizado com sucesso',
                'data' => $patient
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar paciente',
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
            $patient = Patient::find($id);

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente não encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            // Verificar se existem exames associados
            if ($patient->exams()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível excluir paciente com exames associados'
                ], Response::HTTP_CONFLICT);
            }

            $patient->delete();

            return response()->json([
                'success' => true,
                'message' => 'Paciente excluído com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir paciente',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}