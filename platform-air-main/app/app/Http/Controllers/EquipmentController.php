<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentRequest\EquipmentIndexRequest;
use App\Http\Requests\EquipmentRequest\EquipmentStoreRequest;
use App\Http\Requests\EquipmentRequest\EquipmentUpdateRequest;
use App\Models\Equipment;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class EquipmentController extends Controller
{
    private $equipment;

    public function __construct(Equipment $equipment)
    {
        $this->equipment = $equipment;
    }

    public function index(EquipmentIndexRequest $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $query = $this->equipment::query()->with(['model.brand']);

            if ($name = $request->input('name')) {
                $query->where('name', 'like', "%{$name}%");
            }
            if ($modelId = $request->input('model_id')) {
                $query->where('model_id', $modelId);
            }
            if ($sort = $request->input('sort')) {
                $direction = 'asc';
                if (str_starts_with($sort, '-')) {
                    $direction = 'desc';
                    $sort = substr($sort, 1);
                }
                $query->orderBy($sort, $direction);
            } else {
                $query->orderBy('id', 'asc');
            }

            $equipments = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $equipments->items(),
                'meta' => [
                    'current_page' => $equipments->currentPage(),
                    'last_page' => $equipments->lastPage(),
                    'per_page' => $equipments->perPage(),
                    'total' => $equipments->total(),
                ],
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error fetching equipments: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar os equipamentos.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(EquipmentStoreRequest $request)
    {
        try {
            $equipment = $this->equipment::create($request->validated());
            
            // Carregar relacionamentos apenas uma vez
            $equipment->load(['model.brand']);

            return response()->json([
                'status' => 'success',
                'data' => $equipment,
                'message' => 'Equipamento criado com sucesso!',
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Error storing equipment: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar o equipamento.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Equipment $equipment)
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => $equipment->load(['model.brand']),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error showing equipment: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao exibir o equipamento.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(EquipmentUpdateRequest $request, Equipment $equipment)
    {
        try {
            $equipment->update($request->validated());
            
            // Carregar relacionamentos apenas uma vez (sem refresh desnecessário)
            if (!$equipment->relationLoaded('model')) {
                $equipment->load(['model.brand']);
            }

            return response()->json([
                'status' => 'success',
                'data' => $equipment,
                'message' => 'Equipamento atualizado com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error updating equipment: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao atualizar o equipamento.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $equipment = $this->equipment::find($id);
            
            if (!$equipment) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Equipamento não encontrado.',
                ], Response::HTTP_NOT_FOUND);
            }

            $equipment->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Equipamento deletado com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error deleting equipment: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao deletar o equipamento.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}


