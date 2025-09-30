import React, { useState } from 'react';
import { ManutencaoPeca } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface ManutencaoPecasTableProps {
  pecas: ManutencaoPeca[];
  onAdd: () => void;
  onEdit: (peca: ManutencaoPeca) => void;
  onDelete: (id: number) => void;
}

export function ManutencaoPecasTable({ pecas, onAdd, onEdit, onDelete }: ManutencaoPecasTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPecas = pecas.filter(peca =>
    peca.nome_peca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (peca.observacoes && peca.observacoes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Peças de Manutenção</CardTitle>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Peça
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar peças..."
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
              <TableHead>Nome da Peça</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPecas.map((peca) => (
              <TableRow key={peca.id}>
                <TableCell className="font-medium">{peca.nome_peca}</TableCell>
                <TableCell>{peca.quantidade || '-'}</TableCell>
                <TableCell className="max-w-xs">
                  {peca.observacoes || '-'}
                </TableCell>
                <TableCell>{new Date(peca.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(peca)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(peca.id)}
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
