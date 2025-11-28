import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { FuncionariosPage } from './pages/FuncionariosPage';
import { RequisicoesPage } from './pages/RequisicoesPage';
import { RelatoriosPage } from './pages/RelatoriosPage';
import { QRCodePage } from './pages/QRCodePage';
import { RequisicaoPublicaPage } from './pages/RequisicaoPublicaPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública sem sidebar */}
        <Route path="/requisicao/:id" element={<RequisicaoPublicaPage />} />
        
        {/* Rotas com sidebar */}
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/funcionarios" element={<FuncionariosPage />} />
          <Route path="/requisicoes" element={<RequisicoesPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/qr-code" element={<QRCodePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
