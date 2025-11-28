import api, { ApiResponse } from './api';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreateData {
  name: string;
  email: string;
  phone?: string;
  department?: string;
}

export interface EmployeeUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
}

interface EmployeeListParams {
  per_page?: number;
  name?: string;
  department?: string;
  sort?: string;
}

export const employeeService = {
  list: async (params?: EmployeeListParams): Promise<ApiResponse<Employee[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.sort) queryParams.append('sort', params.sort);

    const query = queryParams.toString();
    return api.get<Employee[]>(`/employee${query ? `?${query}` : ''}`);
  },

  getById: async (id: number): Promise<ApiResponse<Employee>> => {
    return api.get<Employee>(`/employee/${id}`);
  },

  create: async (data: EmployeeCreateData): Promise<ApiResponse<Employee>> => {
    return api.post<Employee>('/employee', data);
  },

  update: async (id: number, data: EmployeeUpdateData): Promise<ApiResponse<Employee>> => {
    return api.patch<Employee>(`/employee/${id}`, data);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/employee/${id}`);
  },
};

export default employeeService;

