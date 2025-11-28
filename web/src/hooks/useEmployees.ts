import { useState, useEffect } from 'react';
import { employeeService, Employee, EmployeeCreateData, EmployeeUpdateData } from '../services/employeeService';
import { ApiResponse } from '../services/api';

interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  createEmployee: (data: EmployeeCreateData) => Promise<ApiResponse<Employee>>;
  updateEmployee: (id: number, data: EmployeeUpdateData) => Promise<ApiResponse<Employee>>;
  deleteEmployee: (id: number) => Promise<ApiResponse<void>>;
  fetchEmployees: () => Promise<void>;
}

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.list();
      if (response.status === 'success' && response.data) {
        setEmployees(response.data);
      } else {
        setError(response.message || 'Erro ao carregar funcionários');
      }
    } catch (err) {
      setError('Erro ao carregar funcionários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (data: EmployeeCreateData): Promise<ApiResponse<Employee>> => {
    setError(null);
    try {
      const response = await employeeService.create(data);
      if (response.status === 'success' && response.data) {
        setEmployees(prev => [...prev, response.data!]);
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Employee> = {
        status: 'error',
        message: 'Erro ao criar funcionário',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const updateEmployee = async (id: number, data: EmployeeUpdateData): Promise<ApiResponse<Employee>> => {
    setError(null);
    try {
      const response = await employeeService.update(id, data);
      if (response.status === 'success' && response.data) {
        setEmployees(prev => prev.map(emp => emp.id === id ? response.data! : emp));
      } else {
        await fetchEmployees();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Employee> = {
        status: 'error',
        message: 'Erro ao atualizar funcionário',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const deleteEmployee = async (id: number): Promise<ApiResponse<void>> => {
    setError(null);
    try {
      const response = await employeeService.delete(id);
      if (response.status === 'success') {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      } else {
        await fetchEmployees();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<void> = {
        status: 'error',
        message: 'Erro ao deletar funcionário',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployees,
  };
};

