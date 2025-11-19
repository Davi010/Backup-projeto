import api, { ApiResponse } from './api';

export interface Equipment {
  id: number;
  name: string;
  model_id: number;
  quantity: number;
  btus?: number;
  status: 'funcionando' | 'manutencao' | 'defeito' | 'desativado';
  notes?: string;
  created_at: string;
  updated_at: string;
  model?: {
    id: number;
    name: string;
    brand_id: number;
    brand?: {
      id: number;
      name: string;
    };
  };
}

export interface EquipmentCreateData {
  name: string;
  model_id: number;
  quantity: number;
  btus?: number;
  status: 'funcionando' | 'manutencao' | 'defeito' | 'desativado';
  notes?: string;
}

export interface EquipmentUpdateData {
  name?: string;
  model_id?: number;
  quantity?: number;
  btus?: number;
  status?: 'funcionando' | 'manutencao' | 'defeito' | 'desativado';
  notes?: string;
}

interface EquipmentListParams {
  per_page?: number;
  name?: string;
  model_id?: number;
  sort?: string;
}

export const equipmentService = {
  // Listar todos os equipamentos com paginação e filtros
  list: async (params?: EquipmentListParams): Promise<ApiResponse<Equipment[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.model_id) queryParams.append('model_id', params.model_id.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const query = queryParams.toString();
    return api.get<Equipment[]>(`/equipment${query ? `?${query}` : ''}`);
  },

  // Buscar equipamento por ID
  getById: async (id: number): Promise<ApiResponse<Equipment>> => {
    return api.get<Equipment>(`/equipment/${id}`);
  },

  // Criar novo equipamento
  create: async (data: EquipmentCreateData): Promise<ApiResponse<Equipment>> => {
    return api.post<Equipment>('/equipment', data);
  },

  // Atualizar equipamento
  update: async (id: number, data: EquipmentUpdateData): Promise<ApiResponse<Equipment>> => {
    return api.patch<Equipment>(`/equipment/${id}`, data);
  },

  // Deletar equipamento
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/equipment/${id}`);
  },
};

export default equipmentService;





