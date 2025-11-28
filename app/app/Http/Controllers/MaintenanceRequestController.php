<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MaintenanceRequestController extends Controller
{
    private $maintenanceRequest;

    public function __construct(MaintenanceRequest $maintenanceRequest)
    {
        $this->maintenanceRequest = $maintenanceRequest;
    }

    public function index(Request $request)
    {
        try {
            $query = $this->maintenanceRequest::query()->with(['equipment.model.brand', 'employee']);

            $requests = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'status' => 'success',
                'data' => $requests,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error fetching maintenance requests: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar as requisições.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'equipment_id' => 'required|exists:equipment,id',
                'employee_id' => 'required|exists:employees,id',
                'room' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:pending,completed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $data = $validator->validated();
            $data['status'] = $data['status'] ?? 'pending';

            $maintenanceRequest = $this->maintenanceRequest::create($data);
            $maintenanceRequest->load(['equipment.model.brand', 'employee']);

            return response()->json([
                'status' => 'success',
                'data' => $maintenanceRequest,
                'message' => 'Requisição criada com sucesso!',
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Error storing maintenance request: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar a requisição.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(MaintenanceRequest $maintenanceRequest)
    {
        try {
            $maintenanceRequest->load(['equipment.model.brand', 'employee']);
            return response()->json([
                'status' => 'success',
                'data' => $maintenanceRequest,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error showing maintenance request: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao exibir a requisição.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request, MaintenanceRequest $maintenanceRequest)
    {
        try {
            $validator = Validator::make($request->all(), [
                'equipment_id' => 'sometimes|exists:equipment,id',
                'employee_id' => 'sometimes|exists:employees,id',
                'room' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:pending,completed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $maintenanceRequest->update($validator->validated());
            $maintenanceRequest->load(['equipment.model.brand', 'employee']);

            return response()->json([
                'status' => 'success',
                'data' => $maintenanceRequest,
                'message' => 'Requisição atualizada com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error updating maintenance request: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao atualizar a requisição.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(MaintenanceRequest $maintenanceRequest)
    {
        try {
            $maintenanceRequest->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Requisição deletada com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error deleting maintenance request: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao deletar a requisição.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

