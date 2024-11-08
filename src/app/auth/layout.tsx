import type { Metadata } from 'next';
import '../../app/globals.css';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'TYG Investments',
  description: 'Track your growth investments',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
    const session = await getServerSession(authOptions);
  return (
      <div className="auth-container">
        {children}
      </div>
  );
}