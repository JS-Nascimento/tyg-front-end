import type { Metadata } from 'next';
import '../../app/globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'TYG Investments',
  description: 'Track your growth investments',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
      <div className="auth-container">
        {children}
      </div>
  );
}