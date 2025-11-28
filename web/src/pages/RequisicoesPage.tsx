import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Wrench, Plus, CheckCircle, Edit, Search } from 'lucide-react';
import { useMaintenanceRequests } from '../hooks/useMaintenanceRequests';
import { useEmployees } from '../hooks/useEmployees';
import { useEquipments } from '../hooks/useEquipments';

export function RequisicoesPage() {
  const { requests, loading, error, createRequest, updateRequest } = useMaintenanceRequests();
  const { employees } = useEmployees();
  const { equipments } = useEquipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    equipment_id: '',
    employee_id: '',
    room: '',
    description: '',
    status: 'pending' as 'pending' | 'completed'
  });

  const filteredRequests = requests.filter(req =>
    req.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.employee?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRequest) {
        // Modo edição
        await updateRequest(editingRequest.id, {
          equipment_id: parseInt(formData.equipment_id),
          employee_id: parseInt(formData.employee_id),
          room: formData.room,
          description: formData.description,
          status: formData.status
        });
      } else {
        // Modo criação
        await createRequest({
          equipment_id: parseInt(formData.equipment_id),
          employee_id: parseInt(formData.employee_id),
          room: formData.room,
          description: formData.description,
          status: formData.status
        });
      }
      setShowForm(false);
      setEditingRequest(null);
      setFormData({ equipment_id: '', employee_id: '', room: '', description: '', status: 'pending' });
    } catch (error) {
      console.error('Erro ao salvar requisição:', error);
    }
  };

  const handleEdit = (request: any) => {
    setEditingRequest(request);
    setFormData({
      equipment_id: request.equipment_id.toString(),
      employee_id: request.employee_id.toString(),
      room: request.room,
      description: request.description || '',
      status: request.status || 'pending'
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRequest(null);
    setFormData({ equipment_id: '', employee_id: '', room: '', description: '', status: 'pending' });
  };

  const handleComplete = async (id: number) => {
    await updateRequest(id, { status: 'completed' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Requisições de Manutenção</h1>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingRequest(null); setFormData({ equipment_id: '', employee_id: '', room: '', description: '', status: 'pending' }); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Requisição
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingRequest ? 'Editar Requisição' : 'Nova Requisição'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equipment_id">Ar Condicionado *</Label>
                    <Select
                      value={formData.equipment_id}
                      onValueChange={(value) => setFormData({ ...formData, equipment_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o equipamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipments.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id.toString()}>
                            {eq.name} - {eq.model?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employee_id">Funcionário Responsável *</Label>
                    <Select
                      value={formData.employee_id}
                      onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="room">Sala *</Label>
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  {editingRequest && (
                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as 'pending' | 'completed' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingRequest ? 'Atualizar' : 'Salvar'}</Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Requisições</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar requisição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">Erro ao carregar requisições</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sala</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhuma requisição encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.room}</TableCell>
                        <TableCell>{request.equipment?.name}</TableCell>
                        <TableCell>{request.employee?.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'completed' ? 'Concluída' : 'Pendente'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(request)}
                              title="Editar requisição"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            {request.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleComplete(request.id)}
                                title="Marcar como concluída"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

