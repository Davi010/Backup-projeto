import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { FileText, Download } from 'lucide-react';
import { useMaintenanceRequests } from '../hooks/useMaintenanceRequests';
import { useEquipments } from '../hooks/useEquipments';
import jsPDF from 'jspdf';

export function RelatoriosPage() {
  const { requests } = useMaintenanceRequests();
  const { equipments } = useEquipments();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Relatório de Manutenções', 105, 20, { align: 'center' });
    
    // Período
    if (startDate && endDate) {
      doc.setFontSize(12);
      doc.text(`Período: ${startDate} a ${endDate}`, 105, 30, { align: 'center' });
    }
    
    let y = 50;
    
    // Estatísticas
    const totalRequests = requests.length;
    const completedRequests = requests.filter(r => r.status === 'completed').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    
    doc.setFontSize(14);
    doc.text('Estatísticas Gerais', 20, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.text(`Total de Requisições: ${totalRequests}`, 20, y);
    y += 7;
    doc.text(`Concluídas: ${completedRequests}`, 20, y);
    y += 7;
    doc.text(`Pendentes: ${pendingRequests}`, 20, y);
    y += 15;
    
    // Lista de requisições
    doc.setFontSize(14);
    doc.text('Requisições de Manutenção', 20, y);
    y += 10;
    
    doc.setFontSize(9);
    requests.forEach((request, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(`${index + 1}. Sala: ${request.room}`, 20, y);
      y += 5;
      doc.text(`   Equipamento: ${request.equipment?.name || 'N/A'}`, 20, y);
      y += 5;
      doc.text(`   Funcionário: ${request.employee?.name || 'N/A'}`, 20, y);
      y += 5;
      doc.text(`   Status: ${request.status === 'completed' ? 'Concluída' : 'Pendente'}`, 20, y);
      y += 5;
      if (request.description) {
        doc.text(`   Descrição: ${request.description}`, 20, y);
        y += 5;
      }
      y += 5;
    });
    
    // Salvar PDF
    doc.save('relatorio-manutencoes.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerar Relatório em PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumo</h3>
              <ul className="space-y-1 text-sm">
                <li>Total de Requisições: {requests.length}</li>
                <li>Concluídas: {requests.filter(r => r.status === 'completed').length}</li>
                <li>Pendentes: {requests.filter(r => r.status === 'pending').length}</li>
                <li>Total de Equipamentos: {equipments.length}</li>
              </ul>
            </div>

            <Button onClick={generatePDF} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Gerar e Baixar PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

