import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, ArrowLeft, Save, X, AlertCircle, Loader2 } from 'lucide-react';
import { useBrands } from '../hooks/useBrands';
import { useModels } from '../hooks/useModels';
import { useEquipments } from '../hooks/useEquipments';
import { Equipment } from '../services/equipmentService';

interface FormularioArCondicionadoProps {
  onVoltar: () => void;
  editingAr?: Equipment | any | null;
}

interface FormErrors {
  [key: string]: string;
}

export function FormularioArCondicionado({ onVoltar, editingAr }: FormularioArCondicionadoProps) {
  const { brands, loading: loadingBrands, error: brandsError } = useBrands();
  const { models, loading: loadingModels, error: modelsError } = useModels();
  const { createEquipment, updateEquipment } = useEquipments();

  // Debug: verificar se os dados estão sendo carregados
  React.useEffect(() => {
    if (brands.length > 0) {
      console.log('Marcas carregadas:', brands.length, brands);
    }
    if (models.length > 0) {
      console.log('Modelos carregados:', models.length, models);
    }
    if (brandsError) {
      console.error('Erro ao carregar marcas:', brandsError);
    }
    if (modelsError) {
      console.error('Erro ao carregar modelos:', modelsError);
    }
  }, [brands, models, brandsError, modelsError]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    editingAr?.model?.brand_id?.toString() || ''
  );

  const [formData, setFormData] = useState({
    name: editingAr?.name || '',
    model_id: editingAr?.model_id?.toString() || '',
    quantity: editingAr?.quantity?.toString() || '1',
    btus: editingAr?.btus?.toString() || '',
    status: editingAr?.status || 'funcionando',
    notes: editingAr?.notes || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Atualizar formulário quando editingAr mudar
  useEffect(() => {
    if (editingAr) {
      setFormData({
        name: editingAr.name || '',
        model_id: editingAr.model_id?.toString() || '',
        quantity: editingAr.quantity?.toString() || '1',
        btus: editingAr.btus?.toString() || '',
        status: editingAr.status || 'funcionando',
        notes: editingAr.notes || ''
      });
      setSelectedBrandId(editingAr.model?.brand_id?.toString() || '');
    } else {
      setFormData({
        name: '',
        model_id: '',
        quantity: '1',
        btus: '',
        status: 'funcionando',
        notes: ''
      });
      setSelectedBrandId('');
    }
  }, [editingAr]);


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'O nome do equipamento deve ter pelo menos 3 caracteres';
    }

    if (!formData.model_id) {
      newErrors.model_id = 'O modelo é obrigatório';
    }

    if (parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'A quantidade deve ser pelo menos 1';
    }

    if (formData.btus && (parseInt(formData.btus) < 7000 || parseInt(formData.btus) > 120000)) {
      newErrors.btus = 'Os BTUs devem estar entre 7000 e 120000';
    }

    if (!formData.status) {
      newErrors.status = 'O status é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para envio, removendo campos vazios/undefined
      const equipmentData: any = {
        name: formData.name.trim(),
        model_id: parseInt(formData.model_id),
        quantity: parseInt(formData.quantity),
        status: formData.status as 'funcionando' | 'manutencao' | 'defeito' | 'desativado',
      };

      // Adicionar BTUs apenas se preenchido
      if (formData.btus && formData.btus.trim() !== '') {
        equipmentData.btus = parseInt(formData.btus);
      }

      // Adicionar notas apenas se preenchido
      if (formData.notes && formData.notes.trim() !== '') {
        equipmentData.notes = formData.notes.trim();
      }

      let response;
      if (editingAr?.id) {
        // Modo edição
        response = await updateEquipment(editingAr.id, equipmentData);
      } else {
        // Modo criação
        response = await createEquipment(equipmentData);
      }
      
      if (response.status === 'success') {
        setSubmitSuccess(true);
        setTimeout(() => {
          onVoltar();
        }, 1500);
      } else {
        // Mostrar erros de validação se existirem
        let errorMessage = response.message || 'Erro ao salvar equipamento. Tente novamente.';
        
        if ('errors' in response && response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          errorMessage = errorMessages.join(', ') || errorMessage;
        }
        
        setSubmitError(errorMessage);
      }
    } catch (error) {
      setSubmitError('Erro ao salvar equipamento. Tente novamente.');
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Garantir que nunca seja string vazia para campos de select
    const sanitizedValue = (field === 'model_id' && value === '') ? '' : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onVoltar}
          className="flex items-center gap-2 mb-4"
          data-testid="btn-voltar"
        >
          <ArrowLeft className="h-4 w-4" />
          ← Voltar
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {editingAr ? 'Editar Ar Condicionado' : 'Novo Ar Condicionado'}
        </h1>
        <p className="text-gray-600">
          {editingAr 
            ? 'Edite as informações do aparelho de ar condicionado'
            : 'Cadastre um novo aparelho de ar condicionado no sistema'}
        </p>
      </div>

      {/* Form */}
      <Card className="max-w-4xl mx-auto" data-testid="equipment-form">
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
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800" data-testid="success-message">
              <AlertCircle className="h-5 w-5" />
              <span>Equipamento salvo com sucesso!</span>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800" data-testid="error-message">
              <AlertCircle className="h-5 w-5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Equipamento */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do Equipamento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                data-testid="equipment-name-input"
                placeholder="Ex: Ar Condicionado Sala 101"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1" data-testid="error-name">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Informações de Marca e Modelo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand_filter" className="text-sm font-medium">
                  Filtrar por Marca
                </Label>
                <Select 
                  value={selectedBrandId || 'all'} 
                  onValueChange={(value) => {
                    setSelectedBrandId(value === 'all' ? '' : value);
                    handleInputChange('model_id', ''); // Limpar modelo quando mudar marca
                  }}
                  disabled={loadingBrands}
                >
                  <SelectTrigger data-testid="brand-filter-select">
                    <SelectValue placeholder={loadingBrands ? "Carregando..." : "Filtrar por marca (opcional)"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as marcas</SelectItem>
                    {brands.length === 0 && !loadingBrands ? (
                      <SelectItem value="no-brands" disabled>
                        Nenhuma marca disponível
                      </SelectItem>
                    ) : (
                      brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()} data-testid={`brand-option-${brand.id}`}>
                          {brand.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {brandsError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {brandsError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model_id" className="text-sm font-medium">
                  Modelo <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.model_id && formData.model_id.trim() !== '' ? formData.model_id : undefined} 
                  onValueChange={(value) => {
                    if (value && value !== 'no-models-available') {
                      handleInputChange('model_id', value);
                    }
                  }}
                  disabled={loadingModels}
                >
                  <SelectTrigger className={errors.model_id ? 'border-red-500' : ''} data-testid="model-select">
                    <SelectValue placeholder={loadingModels ? "Carregando..." : "Selecione o modelo"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const filteredModels = models.filter(model => 
                        !selectedBrandId || 
                        selectedBrandId === 'all' || 
                        selectedBrandId === '' ||
                        model.brand_id.toString() === selectedBrandId
                      );
                      
                      if (filteredModels.length === 0) {
                        return (
                          <SelectItem value="no-models-available" disabled>
                            Nenhum modelo disponível
                          </SelectItem>
                        );
                      }
                      
                      return filteredModels.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()} data-testid={`model-option-${model.id}`}>
                          {model.name}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
                {errors.model_id && (
                  <p className="text-sm text-red-600 flex items-center gap-1" data-testid="error-model_id">
                    <AlertCircle className="h-4 w-4" />
                    {errors.model_id}
                  </p>
                )}
              </div>
            </div>

            {/* Quantidade, BTUs e Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  data-testid="quantity-input"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  required
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-600 flex items-center gap-1" data-testid="error-quantity">
                    <AlertCircle className="h-4 w-4" />
                    {errors.quantity}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="btus" className="text-sm font-medium">
                  BTUs
                </Label>
                <Input
                  id="btus"
                  data-testid="btus-input"
                  type="number"
                  min="7000"
                  max="120000"
                  step="1000"
                  placeholder="Ex: 12000"
                  value={formData.btus}
                  onChange={(e) => handleInputChange('btus', e.target.value)}
                  className={errors.btus ? 'border-red-500' : ''}
                />
                {errors.btus && (
                  <p className="text-sm text-red-600 flex items-center gap-1" data-testid="error-btus">
                    <AlertCircle className="h-4 w-4" />
                    {errors.btus}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Capacidade de refrigeração (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''} data-testid="status-select">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funcionando" data-testid="status-option-funcionando">Funcionando</SelectItem>
                    <SelectItem value="manutencao" data-testid="status-option-manutencao">Em Manutenção</SelectItem>
                    <SelectItem value="defeito" data-testid="status-option-defeito">Com Defeito</SelectItem>
                    <SelectItem value="desativado" data-testid="status-option-desativado">Desativado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600 flex items-center gap-1" data-testid="error-status">
                    <AlertCircle className="h-4 w-4" />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>

            {/* Notas/Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notas/Observações
              </Label>
              <Textarea
                id="notes"
                data-testid="notes-textarea"
                placeholder="Informações adicionais sobre o equipamento..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6 border-t">
              <Button 
                type="submit" 
                disabled={isSubmitting || loadingBrands || loadingModels}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                data-testid="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Equipamento
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onVoltar}
                disabled={isSubmitting}
                className="flex items-center gap-2"
                data-testid="btn-cancelar"
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
