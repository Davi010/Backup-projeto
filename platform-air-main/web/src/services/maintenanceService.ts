import api, { ApiResponse } from './api';

export interface Maintenance {
  id: number;
  equipment_id: number;
  user_id: number;
  user_name: string;
  location_id: number;
  location_name: string;
  description?: string;
  service_date: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceCreateData {
  equipment_id: number;
  user_id: number;
  user_name?: string;
  location_id: number;
  location_name?: string;
  description?: string;
  service_date: string;
}

export interface MaintenanceUpdateData {
  equipment_id?: number;
  user_id?: number;
  user_name?: string;
  location_id?: number;
  location_name?: string;
  description?: string;
  service_date?: string;
}

export const maintenanceService = {
  // Listar todas as manutenções
  list: async (): Promise<ApiResponse<Maintenance[]>> => {
    return api.get<Maintenance[]>('/maintenances');
  },

  // Buscar manutenção por ID
  getById: async (id: number): Promise<ApiResponse<Maintenance>> => {
    return api.get<Maintenance>(`/maintenances/${id}`);
  },

  // Criar nova manutenção
  create: async (data: MaintenanceCreateData): Promise<ApiResponse<Maintenance>> => {
    return api.post<Maintenance>('/maintenances', data);
  },

  // Atualizar manutenção
  update: async (id: number, data: MaintenanceUpdateData): Promise<ApiResponse<Maintenance>> => {
    return api.patch<Maintenance>(`/maintenances/${id}`, data);
  },

  // Deletar manutenção
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/maintenances/${id}`);
  },
};

export default maintenanceService;


