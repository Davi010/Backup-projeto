import api, { ApiResponse } from './api';

export interface MaintenanceRequest {
  id: number;
  equipment_id: number;
  employee_id: number;
  room: string;
  description?: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
  equipment?: {
    id: number;
    name: string;
    model?: {
      id: number;
      name: string;
    };
  };
  employee?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MaintenanceRequestCreateData {
  equipment_id: number;
  employee_id: number;
  room: string;
  description?: string;
  status: 'pending' | 'completed';
}

export interface MaintenanceRequestUpdateData {
  equipment_id?: number;
  employee_id?: number;
  room?: string;
  description?: string;
  status?: 'pending' | 'completed';
}

export const maintenanceRequestService = {
  list: async (): Promise<ApiResponse<MaintenanceRequest[]>> => {
    return api.get<MaintenanceRequest[]>('/maintenance-request');
  },

  getById: async (id: number): Promise<ApiResponse<MaintenanceRequest>> => {
    return api.get<MaintenanceRequest>(`/maintenance-request/${id}`);
  },

  create: async (data: MaintenanceRequestCreateData): Promise<ApiResponse<MaintenanceRequest>> => {
    return api.post<MaintenanceRequest>('/maintenance-request', data);
  },

  update: async (id: number, data: MaintenanceRequestUpdateData): Promise<ApiResponse<MaintenanceRequest>> => {
    return api.patch<MaintenanceRequest>(`/maintenance-request/${id}`, data);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/maintenance-request/${id}`);
  },
};

export default maintenanceRequestService;

