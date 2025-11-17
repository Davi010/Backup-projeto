import api, { ApiResponse } from './api';

export interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface BrandCreateData {
  name: string;
}

export interface BrandUpdateData {
  name: string;
}

interface BrandListParams {
  per_page?: number;
  name?: string;
  sort?: string;
}

export const brandService = {
  // Listar todas as marcas com paginação e filtros
  list: async (params?: BrandListParams): Promise<ApiResponse<Brand[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.sort) queryParams.append('sort', params.sort);

    const query = queryParams.toString();
    return api.get<Brand[]>(`/brand${query ? `?${query}` : ''}`);
  },

  // Buscar marca por ID
  getById: async (id: number): Promise<ApiResponse<Brand>> => {
    return api.get<Brand>(`/brand/${id}`);
  },

  // Criar nova marca
  create: async (data: BrandCreateData): Promise<ApiResponse<Brand>> => {
    return api.post<Brand>('/brand', data);
  },

  // Atualizar marca
  update: async (id: number, data: BrandUpdateData): Promise<ApiResponse<Brand>> => {
    return api.patch<Brand>(`/brand/${id}`, data);
  },

  // Deletar marca
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/brand/${id}`);
  },
};

export default brandService;


