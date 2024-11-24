// app/layout.tsx
'use client';
import './globals.css';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { ThemeProvider } from '@/app/themes/ThemeContext';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { LoadingProvider, useLoading } from '@/app/components/LoadingSystem';
import { registerLicense } from '@syncfusion/ej2-base';
import { ToastProvider } from './services/ToastService';
import { useUserStore } from '@/app/store/userStore';

// Registre sua licença Syncfusion
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH5ednVdR2VZUER+X0Q=');

// Syncfusion provider
const SyncfusionProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Ative os efeitos de ripple (opcional)
    import('@syncfusion/ej2-base').then(({ enableRipple }) => {
      enableRipple(true);
    });
  }, []);

  return <>{children}</>;
};


interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { startLoading, stopLoading } = useLoading();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {

    const fetchUser = async () => {
      startLoading();
      try {
        const response = await fetch('/api/user/me');
        if (!response.ok) throw new Error('Failed to fetch currency data');

        const user = await response.json();
        setUser({
          tenantId: user.user.tenantId,
          name: user.user.name,
          email: user.user.email,
          settings: user.user.settings,
        });

      } catch (error) {
        console.error('Error fetching user data:', error);

      } finally {
        stopLoading();
      }
    };

    fetchUser().then(r => r);
  }, [setUser, startLoading, stopLoading]);


  const pathname = usePathname();
  const shouldRenderSidebar = !pathname.startsWith('/auth');

  return (
    <html lang="en" suppressHydrationWarning>
    <body suppressHydrationWarning>
    <SessionProvider>
      <LoadingProvider>
        <ThemeProvider>
          <SyncfusionProvider>
            <ToastProvider>
              {shouldRenderSidebar ? (
                <Sidebar logoUrl={'/tyg-logo.png'}>
                  {children}
                </Sidebar>
              ) : (
                children
              )}
              {!shouldRenderSidebar}
            </ToastProvider>
          </SyncfusionProvider>
        </ThemeProvider>
      </LoadingProvider>
    </SessionProvider>
    </body>
    </html>
  );
}