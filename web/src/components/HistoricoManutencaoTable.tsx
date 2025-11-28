import React, { useState } from 'react';
import { HistoricoManutencao } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';

interface HistoricoManutencaoTableProps {
  historicos: HistoricoManutencao[];
  onAdd: () => void;
  onEdit: (historico: HistoricoManutencao) => void;
  onDelete: (id: number) => void;
  onViewDetails: (historico: HistoricoManutencao) => void;
}

export function HistoricoManutencaoTable({ 
  historicos, 
  onAdd, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: HistoricoManutencaoTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistoricos = historicos.filter(historico =>
    historico.equipamento?.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    historico.tipo_manutencao?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    historico.localizacao_nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Histórico de Manutenção</CardTitle>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Manutenção
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar manutenções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipamento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Data do Serviço</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistoricos.map((historico) => (
              <TableRow key={historico.id}>
                <TableCell className="font-medium">
                  {historico.equipamento?.modelo}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    historico.tipo_manutencao?.nome === 'Manutenção Preventiva' 
                      ? 'bg-green-100 text-green-800' 
                      : historico.tipo_manutencao?.nome === 'Manutenção Corretiva'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {historico.tipo_manutencao?.nome}
                  </span>
                </TableCell>
                <TableCell>{historico.localizacao_nome}</TableCell>
                <TableCell>{new Date(historico.data_servico).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {historico.descricao || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(historico)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(historico)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(historico.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
