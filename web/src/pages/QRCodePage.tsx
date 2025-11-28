import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { QrCode, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useMaintenanceRequests } from '../hooks/useMaintenanceRequests';

export function QRCodePage() {
  const { requests, loading, error } = useMaintenanceRequests();
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');

  const selectedRequest = requests.find(r => r.id.toString() === selectedRequestId);

  const generateQRData = () => {
    if (!selectedRequest) return '';
    
    try {
      // Gerar URL que aponta para a página pública da requisição
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/requisicao/${selectedRequest.id}`;
      return url;
    } catch (err) {
      console.error('Erro ao gerar dados do QR Code:', err);
      return '';
    }
  };

  const downloadQRCode = () => {
    if (!selectedRequest) return;
    
    const container = document.getElementById('qrcode-container');
    if (!container) return;
    
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx?.drawImage(img, 0, 0, 300, 300);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.download = `qrcode-sala-${selectedRequest.room}.png`;
          downloadLink.href = url;
          downloadLink.click();
          URL.revokeObjectURL(url);
        }
      });
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gerar QR Code</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Requisição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Carregando requisições...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">
                  Erro ao carregar requisições: {error}
                </div>
              ) : (
                <div>
                  <Label htmlFor="request">Requisição</Label>
                  <Select
                    value={selectedRequestId}
                    onValueChange={setSelectedRequestId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma requisição" />
                    </SelectTrigger>
                    <SelectContent>
                      {requests.length === 0 ? (
                        <SelectItem value="no-requests" disabled>
                          Nenhuma requisição disponível
                        </SelectItem>
                      ) : (
                        requests.map((req) => (
                          <SelectItem key={req.id} value={req.id.toString()}>
                            Sala {req.room} - {req.equipment?.name || 'N/A'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedRequest && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="font-semibold">Sala:</span> {selectedRequest.room}
                  </div>
                  <div>
                    <span className="font-semibold">Equipamento:</span> {selectedRequest.equipment?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Funcionário:</span> {selectedRequest.employee?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedRequest.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedRequest.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">
                      <span className="font-semibold">URL do QR Code:</span>
                    </p>
                    <p className="text-xs text-blue-600 break-all p-2 bg-blue-50 rounded font-mono">
                      {generateQRData()}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Ao escanear o QR Code, o dispositivo abrirá esta URL com todas as informações da requisição.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRequest ? (
                <>
                  <div className="flex justify-center bg-white p-4 rounded-lg">
                    <div id="qrcode-container">
                      {(() => {
                        try {
                          const qrData = generateQRData();
                          if (!qrData) {
                            return <div className="text-red-600 text-sm">Erro ao gerar dados do QR Code</div>;
                          }
                          if (!QRCode) {
                            return (
                              <div className="text-red-600 text-sm p-4">
                                Componente QR Code não está disponível.
                              </div>
                            );
                          }
                          return (
                            <QRCode
                              value={qrData}
                              size={200}
                              level="H"
                              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                              viewBox={`0 0 200 200`}
                            />
                          );
                        } catch (err) {
                          console.error('Erro ao renderizar QR Code:', err);
                          return (
                            <div className="text-red-600 text-sm p-4">
                              Erro ao renderizar QR Code. Verifique o console para mais detalhes.
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                  <Button onClick={downloadQRCode} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar QR Code
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {loading ? 'Carregando...' : 'Selecione uma requisição para gerar o QR Code'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

