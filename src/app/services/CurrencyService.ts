// app/services/currencyService.ts
import { BaseCurrency, Currency, CurrencyQuotationHistoryDto } from '@/app/types/BaseCurrency';
import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'auth_token';

const API_URL = process.env.URL_API_TYG_INVESTMENTS + '/' + process.env.API_PATH_V1;

async function getAuthToken(): Promise<string | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);
  return token?.value || null;
}

async function handleResponse(response: Response): Promise<BaseCurrency> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();

  return {
    code: data.code,
    name: data.name,
    symbol: data.symbol,
    currencies: data.currencies.map((currency: Currency) => ({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      decimalPlaces: currency.decimalPlaces,
      conversionRate: {
        rate: currency.conversionRate.rate,
        rateDate: currency.conversionRate.rateDate,
      },
    })),
  };
}

export async function getCurrencyData(): Promise<BaseCurrency> {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('Não autorizado');
    }

    const response = await fetch(`${API_URL}/currencies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // cache de 1 hora
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch currency');
    }

    return handleResponse(response);
  } catch (error) {
    console.error('Currency service error:', error);
    throw error;
  }
}

async function handleHistoryResponse(response: Response): Promise<CurrencyQuotationHistoryDto[]> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();

  return data.map((history: CurrencyQuotationHistoryDto) => ({
    averageRate: history.averageRate,
    maxRate: history.maxRate,
    minRate: history.minRate,
    dateOnly: history.dateOnly,
  }));
}

export async function getCurrencyHistory(code: string, limit?: number): Promise<CurrencyQuotationHistoryDto[]> {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('Não autorizado');
    }

    const params = new URLSearchParams({
      code: code,
    });

    if (limit) {
      params.append('limit', String(limit));
    }

    const response = await fetch(`${API_URL}/currencies/history?${params.toString()}`, {

      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // cache de 1 hora
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch currency');
    }

    return handleHistoryResponse(response);
  } catch (error) {
    console.error('Currency service error:', error);
    throw error;
  }
}

// Exemplo com mais operações
export async function currencyService() {
  const token = await getAuthToken();

  return {
    async getCurrency(code: string) {
      const response = await fetch(`${API_URL}/currencies/${code}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },

    async updateRate(code: string, rate: number) {
      const response = await fetch(`${API_URL}/currencies/${code}/rate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rate }),
      });
      return response.json();
    },
  };
}