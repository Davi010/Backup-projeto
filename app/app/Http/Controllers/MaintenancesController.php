<?php

namespace App\Http\Controllers;

use App\Http\Requests\MaintenanceRequest\MaintenanceIndexRequest;
use App\Http\Requests\MaintenanceRequest\MaintenanceStoreRequest;
use App\Http\Requests\MaintenanceRequest\MaintenanceUpdateRequest;
use App\Models\Maintenance;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class MaintenancesController extends Controller
{
    public function index(MaintenanceIndexRequest $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $query = Maintenance::query()->with(['equipment.model.brand']);

            if ($equipmentId = $request->input('equipment_id')) {
                $query->where('equipment_id', $equipmentId);
            }
            if ($locationId = $request->input('location_id')) {
                $query->where('location_id', $locationId);
            }
            if ($userId = $request->input('user_id')) {
                $query->where('user_id', $userId);
            }
            if ($sort = $request->input('sort')) {
                $direction = 'asc';
                if (str_starts_with($sort, '-')) {
                    $direction = 'desc';
                    $sort = substr($sort, 1);
                }
                $query->orderBy($sort, $direction);
            } else {
                $query->orderBy('service_date', 'desc');
            }

            $maintenances = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $maintenances->items(),
                'meta' => [
                    'current_page' => $maintenances->currentPage(),
                    'last_page' => $maintenances->lastPage(),
                    'per_page' => $maintenances->perPage(),
                    'total' => $maintenances->total(),
                ],
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error fetching maintenances: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar as manutenções.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Maintenance $maintenance)
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => $maintenance->load(['equipment.model.brand']),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error showing maintenance: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao exibir a manutenção.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(MaintenanceStoreRequest $request)
    {
        try {
            $maintenance = Maintenance::create($request->validated());

            return response()->json([
                'status' => 'success',
                'data' => $maintenance->load(['equipment.model.brand']),
                'message' => 'Manutenção criada com sucesso!',
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Error storing maintenance: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar a manutenção.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(MaintenanceUpdateRequest $request, Maintenance $maintenance)
    {
        try {
            $maintenance->update($request->validated());

            return response()->json([
                'status' => 'success',
                'data' => $maintenance->load(['equipment.model.brand']),
                'message' => 'Manutenção atualizada com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error updating maintenance: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao atualizar a manutenção.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(Maintenance $maintenance)
    {
        try {
            $maintenance->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Manutenção deletada com sucesso!',
            ], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            Log::error('Error deleting maintenance: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao deletar a manutenção.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
