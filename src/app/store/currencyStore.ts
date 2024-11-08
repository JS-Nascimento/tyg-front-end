import { create } from 'zustand';
import { CurrencyQuotationHistoryDto } from '@/app/interfaces/BaseCurrency';

interface CurrencyStore {
  currencyData: CurrencyQuotationHistoryDto[];
  isLoading: boolean;
  setData: (data: CurrencyQuotationHistoryDto[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currencyData: [],
  isLoading: false,
  setData: (data) => set({ currencyData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
}));