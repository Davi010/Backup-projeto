import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, ArrowLeft, Save, X } from 'lucide-react';

interface FormularioArCondicionadoProps {
  onVoltar: () => void;
}

export function FormularioArCondicionado({ onVoltar }: FormularioArCondicionadoProps) {
  const [formData, setFormData] = useState({
    nome: '',
    localizacao: '',
    descricao: '',
    status: 'ativo',
    modelo: '',
    marca: '',
    numeroSerie: '',
    capacidadeBtu: '',
    temperaturaConfigurada: '22'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    // Aqui você implementaria a lógica para salvar
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onVoltar}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          ← Voltar
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Novo Ar Condicionado
        </h1>
        <p className="text-gray-600">
          Cadastre um novo aparelho de ar condicionado no sistema
        </p>
      </div>

      {/* Form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">Informações do Ar Condicionado</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Preencha todos os campos obrigatórios para cadastrar o aparelho
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações da Sala */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome da Sala <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  placeholder="Ex: Sala 101 - Matemática"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="localizacao" className="text-sm font-medium">
                  Localização <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="localizacao"
                  placeholder="Ex: Prédio A - 1º Andar"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva informações adicionais sobre a sala..."
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Informações do Aparelho */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Especificações do Aparelho</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="modelo" className="text-sm font-medium">
                    Modelo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="modelo"
                    placeholder="Ex: Split Hi-Wall 12000 BTU"
                    value={formData.modelo}
                    onChange={(e) => handleInputChange('modelo', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="marca" className="text-sm font-medium">
                    Marca <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="marca"
                    placeholder="Ex: LG, Samsung, Daikin"
                    value={formData.marca}
                    onChange={(e) => handleInputChange('marca', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numeroSerie" className="text-sm font-medium">
                    Número de Série <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="numeroSerie"
                    placeholder="Ex: LG2024001"
                    value={formData.numeroSerie}
                    onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="capacidadeBtu" className="text-sm font-medium">
                    Capacidade (BTU) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacidadeBtu"
                    type="number"
                    placeholder="Ex: 12000"
                    value={formData.capacidadeBtu}
                    onChange={(e) => handleInputChange('capacidadeBtu', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperaturaConfigurada" className="text-sm font-medium">
                    Temperatura Configurada (°C)
                  </Label>
                  <Input
                    id="temperaturaConfigurada"
                    type="number"
                    placeholder="22"
                    value={formData.temperaturaConfigurada}
                    onChange={(e) => handleInputChange('temperaturaConfigurada', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4" />
                Salvar Ar Condicionado
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onVoltar}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
