import type { Metadata } from 'next';
import '../../app/globals.css';
import React from 'react';
import { ThemeProvider } from '@/app/themes/ThemeContext';

export const metadata: Metadata = {
  title: 'TYG Investments',
  description: 'Track your growth investments',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <html lang="en">
    <body>
    <ThemeProvider>
      <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}