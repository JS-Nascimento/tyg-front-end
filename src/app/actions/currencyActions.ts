'use server';

import { getCurrencyHistory } from '@/app/services/CurrencyService';

export async function fetchCurrencyHistory(code: string, days: number) {
  try {
    return await getCurrencyHistory(code, days);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
}