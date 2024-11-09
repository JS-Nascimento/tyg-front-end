// app/services/ToastService.tsx
'use client';
import React, { createContext, useContext, useRef, useEffect } from 'react';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  content: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastObj = useRef<ToastComponent | null>(null);
  const position: PositionDataModel = { X: 'Right', Y: 'Top' };

  useEffect(() => {
    const handleClickOutside = () => {
      const current = toastObj.current;
      if (current && !isNullOrUndefined(current)) {
        current.hide('All');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          cssClass: 'e-toast-success',
          icon: 'e-meeting success'
        };
      case 'error':
        return {
          cssClass: 'e-toast-danger',
          icon: 'e-meeting error'
        };
      case 'warning':
        return {
          cssClass: 'e-toast-warning',
          icon: 'e-meeting warning'
        };
      case 'info':
      default:
        return {
          cssClass: 'e-toast-info',
          icon: 'e-meeting info'
        };
    }
  };
  const showToast = ({ title, content, type = 'info', duration = 3000 }: ToastOptions) => {
    const config = getToastConfig(type);

    setTimeout(() => {
      const current = toastObj.current;
      if (current) {
        current.show({
          title: title,
          content: content,
          timeOut: duration,
          cssClass: config.cssClass,
          icon: config.icon,
          showCloseButton: true,
          position: position
        });
      }
    }, 100);
  };

  const hideAllToasts = () => {
    const current = toastObj.current;
    if (current) {
      current.hide('All');
    }
  };

  const handleClose = (): void => {
    // Lógica adicional após fechar se necessário
  };

  const handleBeforeOpen = (): void => {
    // Lógica adicional antes de abrir se necessário
  };

  const handleCreated = (): void => {
    // Lógica adicional quando o componente é criado
  };

  return (
    <ToastContext.Provider value={{ showToast, hideAllToasts }}>
      <ToastComponent
        ref={toastObj}
        id='toast_default'
        position={position}
        created={handleCreated}
        close={handleClose}
        beforeOpen={handleBeforeOpen}
      />
      <style jsx global>{`
          .e-toast-container {
              background:transparent !important;
              max-width: 100%;
              width: auto;
              z-index: 9999;
          }

          .e-toast-container .e-toast {
              border: none;
              color: #fff;
              padding: 16px;
              border-radius: 8px;
              margin: 8px;
              width: 350px;
              font-family: inherit;
          }

          /* Removendo sombra/fundo duplicado */
          .e-toast-container .e-toast .e-toast-message {
              background: none;
              box-shadow: none;
              padding: 0 !important;
          }

          /* Estilo dos ícones */
          .e-meeting.success::before {
              content: "✓";
              font-size: 18px;
              font-weight: bold;
          }

          .e-meeting.error::before {
              content: "×";
              font-size: 18px;
              font-weight: bold;
          }

          .e-meeting.warning::before {
              content: "!";
              font-size: 18px;
              font-weight: bold;
          }

          .e-meeting.info::before {
              content: "i";
              font-size: 18px;
              font-weight: bold;
          }

          /* Estilos por tipo */
          .e-toast-success {
              background-color: #22C55E;
              opacity: 1 ;
          }

          .e-toast-danger {
              background-color: #EF4444;
          }

          .e-toast-warning {
              background-color: #F59E0B;
          }

          .e-toast-info {
              background-color: #3B82F6;
          }

          /* Ícone container */
          .e-meeting {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              margin-right: 12px;
              background: rgba(255, 255, 255, 0.2);
              color: #fff;
          }

          /* Título */
          .e-toast-container .e-toast .e-toast-message .e-toast-title {
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 4px;
              color: #fff;
          }

          /* Conteúdo */
          .e-toast-container .e-toast .e-toast-message .e-toast-content {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.9);
          }

          /* Botão fechar */
          .e-toast-container .e-toast .e-toast-close-button {
              color: #fff;
              opacity: 0.8;
              font-size: 14px;
              font-weight: bold;
              margin-top: 4px;
          }

          .e-toast-container .e-toast .e-toast-close-button:hover {
              opacity: 1;
          }

          /* Layout interno do toast */
          .e-toast-container .e-toast {
              display: flex;
              align-items: flex-start;
          }

          .e-toast-container .e-toast .e-toast-message {
              display: flex;
              align-items: flex-start;
              flex: 1;
          }

          /* Animações */
          .e-toast-container .e-toast {
              animation: slideIn 0.2s ease-out;
          }

          @keyframes slideIn {
              from {
                  transform: translateX(100%);
                  opacity: 0;
              }
              to {
                  transform: translateX(0);
                  opacity: 1;
              }
          }
      `}</style>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};