// app/layout.tsx
'use client';
import './globals.css';
import React from 'react';
import Sidebar from '@/app/components/Sidebar';
import { ThemeProvider } from '@/app/themes/ThemeContext';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { LoadingProvider } from '@/app/components/LoadingSystem';
import { registerLicense } from '@syncfusion/ej2-base';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from './services/ToastService';

// Syncfusion provider
const SyncfusionProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    // Ative os efeitos de ripple (opcional)
    import('@syncfusion/ej2-base').then(({ enableRipple }) => {
      enableRipple(true);
    });
  }, []);

  return <>{children}</>;
};

// Registre sua licença Syncfusion
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH5ednVdR2VZUER+X0Q=');

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  theme="colored"
                />
              </Sidebar>
            ) : (
              children
            )}
            {!shouldRenderSidebar && (
              <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
              />
            )}
            </ToastProvider>
          </SyncfusionProvider>
        </ThemeProvider>
      </LoadingProvider>
    </SessionProvider>
    </body>
    </html>
  );
}