import api, { ApiResponse } from './api';

export interface Model {
  id: number;
  name: string;
  brand_id: number;
  created_at: string;
  updated_at: string;
}

export interface ModelCreateData {
  name: string;
  brand_id: number;
}

export interface ModelUpdateData {
  name?: string;
  brand_id?: number;
}

interface ModelListParams {
  per_page?: number;
  name?: string;
  sort?: string;
}

export const modelService = {
  // Listar todos os modelos com paginação e filtros
  list: async (params?: ModelListParams): Promise<ApiResponse<Model[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.sort) queryParams.append('sort', params.sort);

    const query = queryParams.toString();
    return api.get<Model[]>(`/model${query ? `?${query}` : ''}`);
  },

  // Buscar modelo por ID
  getById: async (id: number): Promise<ApiResponse<Model>> => {
    return api.get<Model>(`/model/${id}`);
  },

  // Criar novo modelo
  create: async (data: ModelCreateData): Promise<ApiResponse<Model>> => {
    return api.post<Model>('/model', data);
  },

  // Atualizar modelo
  update: async (id: number, data: ModelUpdateData): Promise<ApiResponse<Model>> => {
    return api.patch<Model>(`/model/${id}`, data);
  },

  // Deletar modelo
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/model/${id}`);
  },
};

export default modelService;


