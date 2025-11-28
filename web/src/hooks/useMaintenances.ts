import { useState, useEffect } from 'react';
import maintenanceService, { 
  Maintenance, 
  MaintenanceCreateData, 
  MaintenanceUpdateData 
} from '../services/maintenanceService';
import { ApiResponse } from '../services/api';

interface UseMaintenancesReturn {
  maintenances: Maintenance[];
  loading: boolean;
  error: string | null;
  fetchMaintenances: () => Promise<void>;
  createMaintenance: (data: MaintenanceCreateData) => Promise<ApiResponse<Maintenance>>;
  updateMaintenance: (id: number, data: MaintenanceUpdateData) => Promise<ApiResponse<Maintenance>>;
  deleteMaintenance: (id: number) => Promise<ApiResponse<void>>;
}

export const useMaintenances = (): UseMaintenancesReturn => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await maintenanceService.list();
      if (response.status === 'success' && response.data) {
        setMaintenances(response.data);
      } else {
        setError(response.message || 'Erro ao carregar manutenções');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar manutenções');
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (data: MaintenanceCreateData): Promise<ApiResponse<Maintenance>> => {
    setError(null);
    try {
      const response = await maintenanceService.create(data);
      if (response.status === 'success') {
        await fetchMaintenances();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Maintenance> = {
        status: 'error',
        message: 'Erro ao criar manutenção',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const updateMaintenance = async (id: number, data: MaintenanceUpdateData): Promise<ApiResponse<Maintenance>> => {
    setError(null);
    try {
      const response = await maintenanceService.update(id, data);
      if (response.status === 'success') {
        await fetchMaintenances();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Maintenance> = {
        status: 'error',
        message: 'Erro ao atualizar manutenção',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const deleteMaintenance = async (id: number): Promise<ApiResponse<void>> => {
    setError(null);
    try {
      const response = await maintenanceService.delete(id);
      if (response.status === 'success') {
        await fetchMaintenances();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<void> = {
        status: 'error',
        message: 'Erro ao deletar manutenção',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  return {
    maintenances,
    loading,
    error,
    fetchMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
  };
};





