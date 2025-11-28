import React, { useState } from 'react';
import { TipoManutencao } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface TiposManutencaoTableProps {
  tipos: TipoManutencao[];
  onAdd: () => void;
  onEdit: (tipo: TipoManutencao) => void;
  onDelete: (id: number) => void;
}

export function TiposManutencaoTable({ tipos, onAdd, onEdit, onDelete }: TiposManutencaoTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTipos = tipos.filter(tipo =>
    tipo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tipo.descricao && tipo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Tipos de Manutenção</CardTitle>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Tipo
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar tipos de manutenção..."
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
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTipos.map((tipo) => (
              <TableRow key={tipo.id}>
                <TableCell className="font-medium">{tipo.nome}</TableCell>
                <TableCell className="max-w-xs">
                  {tipo.descricao || '-'}
                </TableCell>
                <TableCell>{new Date(tipo.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(tipo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(tipo.id)}
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
