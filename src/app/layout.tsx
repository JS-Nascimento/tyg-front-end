// app/layout.tsx
'use client';
import './globals.css';
import React from 'react';
import Sidebar from '@/app/components/Sidebar';
import { Notification } from '@/app/types/Notification';
import { ThemeProvider } from '@/app/themes/ThemeContext';
import { usePathname } from 'next/navigation';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const shouldRenderSidebar = !pathname.startsWith('/auth');

  const notificationList: Notification[] = [
    { id: 1, message: 'Relatório de Fechamento Mensal finalizado', read: false },
    { id: 2, message: 'Análise de desempenho de ativo finalizado', read: false },
    { id: 3, message: 'Sua mensalidade está próxima do vencimento', read: false },
  ];

  return (
    <html lang="en">
    <body>
    <ThemeProvider>
      {shouldRenderSidebar ? (
      <Sidebar
        logoUrl={'/tyg-logo.png'}
        userEmail={'sardinha.jorge@gmail.com'}
        userName={'Jorge Nascimento'}
        userAvatar={'/avatar.jpg'}
        notifications={notificationList}
      >
        {children}
      </Sidebar>
      ) : (
        children
      )}
    </ThemeProvider>
    </body>
    </html>
  );
}