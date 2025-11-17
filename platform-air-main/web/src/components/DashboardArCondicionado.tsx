import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { FormularioArCondicionado } from "./FormularioArCondicionado";
import { Equipment } from "../services/equipmentService";
import { useEquipments } from "../hooks/useEquipments";
import {
  Thermometer,
  Building2,
  Wrench,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function DashboardArCondicionado() {
  const { equipments, loading, error, fetchEquipments, deleteEquipment } = useEquipments();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<"dashboard" | "formulario">(
    "dashboard"
  );
  const [editingAr, setEditingAr] = useState<Equipment | null>(null);

  // Filtrar equipamentos baseado na busca
  const filteredEquipments = equipments.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.model?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.model?.brand?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas baseadas nos equipamentos reais
  const totalEquipments = equipments.length;
  const totalQuantity = equipments.reduce((sum, eq) => sum + eq.quantity, 0);

  const handleEdit = (equipment: Equipment) => {
    setEditingAr(equipment);
    setCurrentView("formulario");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este equipamento?")) {
      try {
        const response = await deleteEquipment(id);
        if (response.status === 'success') {
          // A lista será atualizada automaticamente pelo hook
        } else {
          alert(response.message || 'Erro ao deletar equipamento');
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao deletar equipamento");
      }
    }
  };

  const handleAdd = () => {
    setEditingAr(null);
    setCurrentView("formulario");
  };

  if (currentView === "formulario") {
    return (
      <FormularioArCondicionado 
        onVoltar={() => {
          setCurrentView("dashboard");
          setEditingAr(null);
        }}
        editingAr={editingAr}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Controle de Ar Condicionado
        </h1>
        <p className="text-gray-600">
          Gerencie todos os aparelhos de ar condicionado das salas de aula
        </p>

        <div className="flex gap-4 mt-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            API Docs
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Novo Ar Condicionado
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Equipamentos
            </CardTitle>
            <Thermometer className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalEquipments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalQuantity} unidades no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Marcas Cadastradas
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : new Set(equipments.map(eq => eq.model?.brand?.id).filter(Boolean)).size}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Marcas diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Modelos Cadastrados
            </CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : new Set(equipments.map(eq => eq.model_id).filter(Boolean)).size}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Modelos diferentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <p className="text-sm text-gray-600">
            Use os filtros abaixo para encontrar aparelhos específicos
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, modelo ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipamentos Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Equipamentos Cadastrados
              </CardTitle>
              <p className="text-sm text-gray-600">
                {loading ? 'Carregando...' : `${filteredEquipments.length} equipamento(s) encontrado(s)`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchEquipments()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          
          {loading && equipments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">Carregando equipamentos...</span>
            </div>
          ) : filteredEquipments.length === 0 ? (
            <div className="text-center py-12">
              <Thermometer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {searchTerm ? 'Nenhum equipamento encontrado com os filtros aplicados' : 'Nenhum equipamento cadastrado ainda'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Equipamento
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipments.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell>
                      <div className="font-medium">{equipment.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-gray-400" />
                        <span>{equipment.model?.name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>{equipment.model?.brand?.name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{equipment.quantity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {equipment.notes || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(equipment.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(equipment)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(equipment.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
