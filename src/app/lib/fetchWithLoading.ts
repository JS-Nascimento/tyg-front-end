// lib/fetchWithLoading.ts
import { useLoading } from '@/app/context/LoadingContext';

type FetchOptions = RequestInit & {
  showLoader?: boolean;
};

export const createFetchWithLoading = (setLoading: (loading: boolean) => void) => {
  return async (url: RequestInfo | URL, options: FetchOptions = {}) => {
    const { showLoader = true, ...fetchOptions } = options;

    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await fetch(url, fetchOptions);
      return response;
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };
};

// Hook para usar o fetch com loading
export function useFetchWithLoading() {
  const { setLoading } = useLoading();
  return createFetchWithLoading(setLoading);
}