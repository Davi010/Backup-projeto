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
import { ArCondicionado, Sala, ManutencaoAr } from "../types";
import { arCondicionados, salas, manutencoesAr } from "../data/mockData";
import { FormularioArCondicionado } from "./FormularioArCondicionado";
import {
  Thermometer,
  Building2,
  Wrench,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<"dashboard" | "formulario">(
    "dashboard"
  );

  const filteredArCondicionados = arCondicionados.filter(
    (ar) =>
      ar.sala?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ar.sala?.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ar.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "funcionando":
        return "bg-green-100 text-green-800";
      case "manutencao":
        return "bg-yellow-100 text-yellow-800";
      case "defeito":
        return "bg-red-100 text-red-800";
      case "desligado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "funcionando":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "manutencao":
        return <Wrench className="h-4 w-4 text-yellow-600" />;
      case "defeito":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "desligado":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "funcionando":
        return "Funcionando";
      case "manutencao":
        return "Manutenção";
      case "defeito":
        return "Defeito";
      case "desligado":
        return "Desligado";
      default:
        return "Desconhecido";
    }
  };

  const totalArCondicionados = arCondicionados.length;
  const funcionando = arCondicionados.filter(
    (ar) => ar.status === "funcionando"
  ).length;
  const emManutencao = arCondicionados.filter(
    (ar) => ar.status === "manutencao"
  ).length;
  const comDefeito = arCondicionados.filter(
    (ar) => ar.status === "defeito"
  ).length;

  if (currentView === "formulario") {
    return (
      <FormularioArCondicionado onVoltar={() => setCurrentView("dashboard")} />
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
            onClick={() => setCurrentView("formulario")}
          >
            <Plus className="h-4 w-4" />
            Novo Ar Condicionado
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total
            </CardTitle>
            <Thermometer className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalArCondicionados}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Funcionando
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {funcionando}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Manutenção
            </CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {emManutencao}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Com Defeito
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{comDefeito}</div>
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
                placeholder="Buscar por sala, localização ou modelo..."
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

      {/* Ar Condicionados Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Aparelhos de Ar Condicionado
          </CardTitle>
          <p className="text-sm text-gray-600">
            {filteredArCondicionados.length} aparelhos encontrados
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sala</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Temperatura</TableHead>
                <TableHead>Próxima Manutenção</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArCondicionados.map((ar) => (
                <TableRow key={ar.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ar.sala?.nome}</div>
                      <div className="text-sm text-gray-500">
                        {ar.modelo} - {ar.marca}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{ar.sala?.localizacao}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ar.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          ar.status
                        )}`}
                      >
                        {getStatusText(ar.status)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-gray-400" />
                      <span>{ar.temperatura_atual}°C</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {new Date(ar.proxima_manutencao).toLocaleDateString(
                        "pt-BR"
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
