import { useState, useEffect } from 'react';
import modelService, { Model, ModelCreateData, ModelUpdateData } from '../services/modelService';
import { ApiResponse } from '../services/api';

interface UseModelsReturn {
  models: Model[];
  loading: boolean;
  error: string | null;
  fetchModels: () => Promise<void>;
  createModel: (data: ModelCreateData) => Promise<ApiResponse<Model>>;
  updateModel: (id: number, data: ModelUpdateData) => Promise<ApiResponse<Model>>;
  deleteModel: (id: number) => Promise<ApiResponse<void>>;
}

export const useModels = (): UseModelsReturn => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await modelService.list();
      if (response.status === 'success' && response.data) {
        setModels(response.data);
      } else {
        setError(response.message || 'Erro ao carregar modelos');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar modelos');
    } finally {
      setLoading(false);
    }
  };

  const createModel = async (data: ModelCreateData): Promise<ApiResponse<Model>> => {
    setError(null);
    try {
      const response = await modelService.create(data);
      if (response.status === 'success') {
        await fetchModels();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Model> = {
        status: 'error',
        message: 'Erro ao criar modelo',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const updateModel = async (id: number, data: ModelUpdateData): Promise<ApiResponse<Model>> => {
    setError(null);
    try {
      const response = await modelService.update(id, data);
      if (response.status === 'success') {
        await fetchModels();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Model> = {
        status: 'error',
        message: 'Erro ao atualizar modelo',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const deleteModel = async (id: number): Promise<ApiResponse<void>> => {
    setError(null);
    try {
      const response = await modelService.delete(id);
      if (response.status === 'success') {
        await fetchModels();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<void> = {
        status: 'error',
        message: 'Erro ao deletar modelo',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    loading,
    error,
    fetchModels,
    createModel,
    updateModel,
    deleteModel,
  };
};


