import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

// Interfaces
interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  showLoading: (timeInMs?: number) => Promise<void>;
}

interface LoadingProviderProps {
  children: ReactNode;
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Contexto para gerenciar o estado global do loading
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
  showLoading: async () => {},
});

// Provider do Loading
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [activeLoadings, setActiveLoadings] = useState<number>(0);

  const startLoading = useCallback(() => {
    setActiveLoadings(prev => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setActiveLoadings(prev => Math.max(0, prev - 1));
  }, []);

  // Função para mostrar loading por um tempo específico
  const showLoading = useCallback(async (timeInMs = 1000): Promise<void> => {
    startLoading();
    await new Promise(resolve => setTimeout(resolve, timeInMs));
    stopLoading();
  }, [startLoading, stopLoading]);

  const value = {
    isLoading: activeLoadings > 0,
    startLoading,
    stopLoading,
    showLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {value.isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <FancyLoading />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

// Hook personalizado para usar o loading
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider');
  }
  return context;
};

// Hook para automatizar loading em fetch/axios
export const useFetchWithLoading = () => {
  const { startLoading, stopLoading } = useLoading();

  const fetchWithLoading = async <T,>(url: string, options: FetchOptions = {}): Promise<T> => {
    try {
      startLoading();
      const response = await fetch(url, options);
      const data = await response.json();
      return data as T;
    } finally {
      stopLoading();
    }
  };

  return fetchWithLoading;
};

// Hook para automatizar loading em qualquer Promise
export const usePromiseWithLoading = () => {
  const { startLoading, stopLoading } = useLoading();

  const withLoading = async <T,>(promise: Promise<T>): Promise<T> => {
    try {
      startLoading();
      const result = await promise;
      return result;
    } finally {
      stopLoading();
    }
  };

  return withLoading;
};

// Componente FancyLoading
const FancyLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-8 bg-transparent p-8 rounded-lg">
      <div className="relative w-24 h-24">
        <div className="absolute w-full h-full rounded-full border-8 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-indigo-500 animate-spin" />
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
    </div>
  );
};

export default FancyLoading;