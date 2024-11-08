'use client';

import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { Toast, ToastModel } from '@syncfusion/ej2-notifications';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import '@syncfusion/ej2-notifications/styles/material.css';

export interface SyncToastRef {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const SyncToast = forwardRef<SyncToastRef>((_, ref) => {
  const toastContainerRef = useRef<HTMLDivElement>(null);
  const toastObj = useRef<Toast | null>(null);

  const position = useMemo<PositionDataModel>(() => ({ X: 'Right', Y: 'Top' }), []);

  useImperativeHandle(ref, () => ({
    showToast(message: string, type: 'success' | 'error') {
      if (toastContainerRef.current) {
        // Se o Toast já existe, destrói-o antes de criar um novo
        if (toastObj.current) {
          toastObj.current.destroy();
        }

        // Configurações do Toast
        const toastConfig: ToastModel = {
          content: message,
          cssClass: type === 'success' ? 'e-toast-success' : 'e-toast-danger',
          position,
          timeOut: 3000,
        };

        // Cria e exibe o Toast
        toastObj.current = new Toast(toastConfig, toastContainerRef.current);
        toastObj.current.show();
      } else {
        console.error("Toast container not initialized.");
      }
    },
  }));

  useEffect(() => {
    if (toastContainerRef.current) {
      toastObj.current = new Toast(
        {
          position,
          close: onClose,
          beforeOpen: onBeforeOpen,
          timeOut: 3000,
        },
        toastContainerRef.current
      );
    }

    const handleClickOutside = () => {
      toastObj.current?.hide('All');
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      toastObj.current?.destroy();
    };
  }, [position]);

  const onClose = () => {
    console.log('Toast fechado');
  };

  const onBeforeOpen = () => {
    console.log('Toast prestes a abrir');
  };

  return (
    <div
      ref={toastContainerRef}
      id="toast_default"
      style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}
    ></div>
  );
});

SyncToast.displayName = 'SyncToast';

export default SyncToast;
