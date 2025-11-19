<?php

namespace App\Http\Controllers;

use App\Http\Requests\ModelsRequest\ModelsIndexRequest;
use App\Http\Requests\ModelsRequest\ModelsStoreRequest;
use App\Http\Requests\ModelsRequest\ModelsUpdateRequest;
use App\Models\Models;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ModelsController extends Controller
{
    private $model;

    public function __construct(Models $model)
    {
        $this->model = $model;
    }

    public function index(ModelsIndexRequest $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $query = $this->model::query()->with(['brand']);

            if ($name = $request->input('name')) {
                $query->where('name', 'like', "%{$name}%");
            }
            if ($brandId = $request->input('brand_id')) {
                $query->where('brand_id', $brandId);
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

            $models = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $models->items(),
                'meta' => [
                    'current_page' => $models->currentPage(),
                    'last_page' => $models->lastPage(),
                    'per_page' => $models->perPage(),
                    'total' => $models->total(),
                ],
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error fetching models: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar os modelos.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(ModelsStoreRequest $request)
    {
        try {
            $model = $this->model::create($request->validated());

            return response()->json([
                'status' => 'success',
                'data' => $model->load(['brand']),
                'message' => 'Modelo criado com sucesso!',
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Error storing model: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao salvar o modelo.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Models $model)
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => $model->load(['brand']),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error showing model: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao exibir o modelo.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(ModelsUpdateRequest $request, Models $model)
    {
        try {
            $model->update($request->validated());

            return response()->json([
                'status' => 'success',
                'data' => $model->load(['brand']),
                'message' => 'Modelo atualizado com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error updating model: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao atualizar o modelo.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(Models $model)
    {
        try {
            $model->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Modelo deletado com sucesso!',
            ], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            Log::error('Error deleting model: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao excluir o modelo.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
