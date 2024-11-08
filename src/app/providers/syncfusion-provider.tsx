'use client';

import React, { useEffect } from 'react';
import { enableRipple } from '@syncfusion/ej2-base';

export default function SyncfusionProvider({
                                             children,
                                           }: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    enableRipple(true);
  }, []);

  return <>{children}</>;
}