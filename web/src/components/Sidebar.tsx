import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Wrench, 
  FileText, 
  QrCode,
  AirVent
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/',
      description: 'Visão geral dos equipamentos'
    },
    {
      title: 'Funcionários',
      icon: Users,
      path: '/funcionarios',
      description: 'Gerenciar funcionários responsáveis'
    },
    {
      title: 'Requisições',
      icon: Wrench,
      path: '/requisicoes',
      description: 'Atrelar funcionários a manutenções'
    },
    {
      title: 'Relatórios',
      icon: FileText,
      path: '/relatorios',
      description: 'Gerar relatórios em PDF'
    },
    {
      title: 'QR Code',
      icon: QrCode,
      path: '/qr-code',
      description: 'Gerar QR codes para salas'
    }
  ];

  return (
    <aside className={cn(
      "w-64 bg-white border-r border-gray-200 min-h-screen p-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-8">
        <AirVent className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">Sistema AC</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                "hover:bg-gray-100",
                isActive 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

