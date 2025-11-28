import { useState, useEffect } from 'react';
import { maintenanceRequestService, MaintenanceRequest, MaintenanceRequestCreateData, MaintenanceRequestUpdateData } from '../services/maintenanceRequestService';
import { ApiResponse } from '../services/api';

interface UseMaintenanceRequestsReturn {
  requests: MaintenanceRequest[];
  loading: boolean;
  error: string | null;
  createRequest: (data: MaintenanceRequestCreateData) => Promise<ApiResponse<MaintenanceRequest>>;
  updateRequest: (id: number, data: MaintenanceRequestUpdateData) => Promise<ApiResponse<MaintenanceRequest>>;
  fetchRequests: () => Promise<void>;
}

export const useMaintenanceRequests = (): UseMaintenanceRequestsReturn => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await maintenanceRequestService.list();
      if (response.status === 'success' && response.data) {
        setRequests(response.data);
      } else {
        setError(response.message || 'Erro ao carregar requisições');
      }
    } catch (err) {
      setError('Erro ao carregar requisições');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (data: MaintenanceRequestCreateData): Promise<ApiResponse<MaintenanceRequest>> => {
    setError(null);
    try {
      const response = await maintenanceRequestService.create(data);
      if (response.status === 'success' && response.data) {
        setRequests(prev => [...prev, response.data!]);
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<MaintenanceRequest> = {
        status: 'error',
        message: 'Erro ao criar requisição',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const updateRequest = async (id: number, data: MaintenanceRequestUpdateData): Promise<ApiResponse<MaintenanceRequest>> => {
    setError(null);
    try {
      const response = await maintenanceRequestService.update(id, data);
      if (response.status === 'success' && response.data) {
        setRequests(prev => prev.map(req => req.id === id ? response.data! : req));
      } else {
        await fetchRequests();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<MaintenanceRequest> = {
        status: 'error',
        message: 'Erro ao atualizar requisição',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequest,
    fetchRequests,
  };
};

