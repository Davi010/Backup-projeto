import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { maintenanceRequestService, MaintenanceRequest } from '../services/maintenanceRequestService';
import { Loader2, CheckCircle, Clock, Building2, User, Wrench } from 'lucide-react';

export function RequisicaoPublicaPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) {
        setError('ID da requisição não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await maintenanceRequestService.getById(parseInt(id));
        
        if (response.status === 'success' && response.data) {
          setRequest(response.data);
        } else {
          setError(response.message || 'Requisição não encontrada');
        }
      } catch (err) {
        setError('Erro ao carregar requisição');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações da requisição...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Requisição não encontrada</h1>
              <p className="text-gray-600">{error || 'A requisição solicitada não existe ou foi removida.'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Wrench className="h-6 w-6" />
              Informações da Requisição
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Status */}
            <div className="flex items-center justify-center">
              <div className={`px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2 ${
                request.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {request.status === 'completed' ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Concluída
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5" />
                    Pendente
                  </>
                )}
              </div>
            </div>

            {/* Informações principais */}
            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-700">Sala</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{request.room}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-700">Equipamento</h3>
                </div>
                <p className="text-lg text-gray-900">
                  {request.equipment?.name || 'N/A'}
                  {request.equipment?.model?.name && (
                    <span className="text-gray-600 ml-2">({request.equipment.model.name})</span>
                  )}
                </p>
                {request.equipment?.model?.brand?.name && (
                  <p className="text-sm text-gray-600 mt-1">
                    Marca: {request.equipment.model.brand.name}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-700">Funcionário Responsável</h3>
                </div>
                <p className="text-lg text-gray-900">{request.employee?.name || 'N/A'}</p>
                {request.employee?.email && (
                  <p className="text-sm text-gray-600 mt-1">{request.employee.email}</p>
                )}
              </div>

              {request.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Descrição</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Data de Criação</h3>
                <p className="text-gray-900">
                  {new Date(request.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {request.updated_at !== request.created_at && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Última Atualização</h3>
                  <p className="text-gray-900">
                    {new Date(request.updated_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>ID da Requisição: #{request.id}</p>
        </div>
      </div>
    </div>
  );
}


