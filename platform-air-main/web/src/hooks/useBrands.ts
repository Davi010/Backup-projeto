import { useState, useEffect } from 'react';
import brandService, { Brand, BrandCreateData, BrandUpdateData } from '../services/brandService';
import { ApiResponse } from '../services/api';

interface UseBrandsReturn {
  brands: Brand[];
  loading: boolean;
  error: string | null;
  fetchBrands: () => Promise<void>;
  createBrand: (data: BrandCreateData) => Promise<ApiResponse<Brand>>;
  updateBrand: (id: number, data: BrandUpdateData) => Promise<ApiResponse<Brand>>;
  deleteBrand: (id: number) => Promise<ApiResponse<void>>;
}

export const useBrands = (): UseBrandsReturn => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar todas as marcas (sem limite de paginação)
      const response = await brandService.list({ per_page: 100 });
      if (response.status === 'success' && response.data) {
        setBrands(response.data);
      } else {
        setError(response.message || 'Erro ao carregar marcas');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar marcas');
      console.error('Erro ao buscar marcas:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (data: BrandCreateData): Promise<ApiResponse<Brand>> => {
    setError(null);
    try {
      const response = await brandService.create(data);
      if (response.status === 'success') {
        await fetchBrands();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Brand> = {
        status: 'error',
        message: 'Erro ao criar marca',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const updateBrand = async (id: number, data: BrandUpdateData): Promise<ApiResponse<Brand>> => {
    setError(null);
    try {
      const response = await brandService.update(id, data);
      if (response.status === 'success') {
        await fetchBrands();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Brand> = {
        status: 'error',
        message: 'Erro ao atualizar marca',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const deleteBrand = async (id: number): Promise<ApiResponse<void>> => {
    setError(null);
    try {
      const response = await brandService.delete(id);
      if (response.status === 'success') {
        await fetchBrands();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<void> = {
        status: 'error',
        message: 'Erro ao deletar marca',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};





