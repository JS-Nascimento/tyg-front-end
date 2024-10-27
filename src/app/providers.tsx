// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './themes/ThemeContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
            {children}
      </ThemeProvider>
    </SessionProvider>
  );
}