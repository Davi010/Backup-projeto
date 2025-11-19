import { useState, useEffect } from 'react';
import equipmentService, { Equipment, EquipmentCreateData, EquipmentUpdateData } from '../services/equipmentService';
import { ApiResponse } from '../services/api';

interface UseEquipmentsReturn {
  equipments: Equipment[];
  loading: boolean;
  error: string | null;
  fetchEquipments: () => Promise<void>;
  createEquipment: (data: EquipmentCreateData) => Promise<ApiResponse<Equipment>>;
  updateEquipment: (id: number, data: EquipmentUpdateData) => Promise<ApiResponse<Equipment>>;
  deleteEquipment: (id: number) => Promise<ApiResponse<void>>;
}

export const useEquipments = (): UseEquipmentsReturn => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await equipmentService.list();
      if (response.status === 'success' && response.data) {
        setEquipments(response.data);
      } else {
        setError(response.message || 'Erro ao carregar equipamentos');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar equipamentos');
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (data: EquipmentCreateData): Promise<ApiResponse<Equipment>> => {
    setError(null);
    try {
      const response = await equipmentService.create(data);
      if (response.status === 'success' && response.data) {
        // Adicionar o novo equipamento à lista sem recarregar tudo
        setEquipments(prev => [...prev, response.data!]);
      } else {
        // Se não tiver dados, recarregar a lista
        await fetchEquipments();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Equipment> = {
        status: 'error',
        message: 'Erro ao criar equipamento',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const updateEquipment = async (id: number, data: EquipmentUpdateData): Promise<ApiResponse<Equipment>> => {
    setError(null);
    try {
      const response = await equipmentService.update(id, data);
      if (response.status === 'success' && response.data) {
        // Atualizar o equipamento na lista sem recarregar tudo
        setEquipments(prev => prev.map(eq => eq.id === id ? response.data! : eq));
      } else {
        // Se não tiver dados, recarregar a lista
        await fetchEquipments();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<Equipment> = {
        status: 'error',
        message: 'Erro ao atualizar equipamento',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  const deleteEquipment = async (id: number): Promise<ApiResponse<void>> => {
    setError(null);
    try {
      const response = await equipmentService.delete(id);
      if (response.status === 'success') {
        // Remover o equipamento da lista sem recarregar tudo
        setEquipments(prev => prev.filter(eq => eq.id !== id));
      } else {
        // Se houver erro, recarregar a lista para garantir consistência
        await fetchEquipments();
      }
      return response;
    } catch (err) {
      const errorResponse: ApiResponse<void> = {
        status: 'error',
        message: 'Erro ao deletar equipamento',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      };
      return errorResponse;
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return {
    equipments,
    loading,
    error,
    fetchEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
  };
};





