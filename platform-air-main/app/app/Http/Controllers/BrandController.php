<?php

namespace App\Http\Controllers;

use App\Http\Requests\BrandRequest\BrandIndexRequest;
use App\Http\Requests\BrandRequest\BrandStoreRequest;
use App\Http\Requests\BrandRequest\BrandUpdateRequest;
use Illuminate\Support\Facades\Log;
use App\Models\Brand;
use Illuminate\Http\Response;

class BrandController extends Controller
{
    private $brand;

    public function __construct(Brand $brand)
    {
        $this->brand = $brand;
    }

     public function index(BrandIndexRequest $request)
    {
        try
        {
            $perPage = $request->input('per_page', 10);
            $query = $this->brand::query();

            if ($name = $request->input('name')) {
                $query->where('name', 'like', "%{$name}%");
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

            $brands = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $brands->items(),
                'meta' => [
                    'current_page' => $brands->currentPage(),
                    'last_page' => $brands->lastPage(),
                    'per_page' => $brands->perPage(),
                    'total' => $brands->total(),
                ],
            ], Response::HTTP_OK);
        }
        catch (\Exception $e)
        {
            Log::error('Error fetching brands: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar as marcas.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(BrandStoreRequest $request)
    {
        try
        {
            $brand = $this->brand::create($request->validated());

            return response()->json([
                'status' => 'success',
                'data' => $brand,
                'message' => 'Marca criada com sucesso!'
            ], Response::HTTP_CREATED);
        }
        catch (\Exception $e)
        {
            Log::error('Error storing brands: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar as marcas.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Brand $brand)
    {
        try
        {
            return response()->json([
                'status' => 'success',
                'data' => $brand,
            ], Response::HTTP_OK);
        }
        catch (\Exception $e)
        {
            Log::error('Error storing brands: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar as marcas.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(BrandUpdateRequest $request, Brand $brand)
    {
        try
        {
            $brand->update($request->validated());

            return response()->json([
                'status' => 'success',
                'data' => $brand,
                'message' => 'Marca atualizada com sucesso!'
            ], Response::HTTP_OK);
        }
        catch (\Exception $e)
        {
            Log::error('Error updating brands: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar as marcas.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(Brand $brand)
    {
        try
        {
            $brand->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Marca deletada com sucesso!'
            ], Response::HTTP_NO_CONTENT);
        }
        catch (\Exception $e)
        {
            Log::error('Error updating brands: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar as marcas.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
