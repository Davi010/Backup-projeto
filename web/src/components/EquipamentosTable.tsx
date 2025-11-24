import React, { useState } from 'react';
import { Equipamento } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface EquipamentosTableProps {
  equipamentos: Equipamento[];
  onAdd: () => void;
  onEdit: (equipamento: Equipamento) => void;
  onDelete: (id: number) => void;
}

export function EquipamentosTable({ equipamentos, onAdd, onEdit, onDelete }: EquipamentosTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipamentos = equipamentos.filter(equipamento =>
    equipamento.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Equipamentos</CardTitle>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Equipamento
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar equipamentos..."
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
              <TableHead>Modelo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Número de Série</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipamentos.map((equipamento) => (
              <TableRow key={equipamento.id}>
                <TableCell className="font-medium">{equipamento.modelo}</TableCell>
                <TableCell>{equipamento.marca}</TableCell>
                <TableCell className="font-mono">{equipamento.numero_serie}</TableCell>
                <TableCell>{equipamento.capacidade || '-'}</TableCell>
                <TableCell>{new Date(equipamento.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(equipamento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(equipamento.id)}
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
