// app/layout.tsx
'use client';
import './globals.css';
import React from 'react';
import Sidebar from '@/app/components/Sidebar';
import { ThemeProvider } from '@/app/themes/ThemeContext';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { LoadingProvider } from '@/app/components/LoadingSystem';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const shouldRenderSidebar = !pathname.startsWith('/auth');


  return (
    <html lang="en">
    <body>
    <SessionProvider>
      <LoadingProvider>
        <ThemeProvider>
          {shouldRenderSidebar ? (
            <Sidebar logoUrl={'/tyg-logo.png'}>
              {children}
            </Sidebar>
          ) : (
            children
          )}
        </ThemeProvider>
      </LoadingProvider>
    </SessionProvider>
    </body>
    </html>
  );
}
