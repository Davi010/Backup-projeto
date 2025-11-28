<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    private $employee;

    public function __construct(Employee $employee)
    {
        $this->employee = $employee;
    }

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $query = $this->employee::query();

            if ($name = $request->input('name')) {
                $query->where('name', 'like', "%{$name}%");
            }
            if ($department = $request->input('department')) {
                $query->where('department', 'like', "%{$department}%");
            }

            $employees = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $employees->items(),
                'meta' => [
                    'current_page' => $employees->currentPage(),
                    'last_page' => $employees->lastPage(),
                    'per_page' => $employees->perPage(),
                    'total' => $employees->total(),
                ],
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error fetching employees: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao listar os funcionários.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:employees,email',
                'phone' => 'nullable|string|max:20',
                'department' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $employee = $this->employee::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'data' => $employee,
                'message' => 'Funcionário criado com sucesso!',
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Error storing employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar o funcionário.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Employee $employee)
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => $employee,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error showing employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao exibir o funcionário.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request, Employee $employee)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:employees,email,' . $employee->id,
                'phone' => 'nullable|string|max:20',
                'department' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $employee->update($validator->validated());

            return response()->json([
                'status' => 'success',
                'data' => $employee,
                'message' => 'Funcionário atualizado com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error updating employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao atualizar o funcionário.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(Employee $employee)
    {
        try {
            $employee->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Funcionário deletado com sucesso!',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error deleting employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao deletar o funcionário.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

