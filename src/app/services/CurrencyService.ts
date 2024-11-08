// app/services/currencyService.ts
import { AvailableCurrency, BaseCurrency, Currency, CurrencyQuotationHistoryDto } from '@/app/interfaces/BaseCurrency';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import HandledError from '@/app/errors/HandledError';

const API_URL = process.env.URL_API_TYG_INVESTMENTS && process.env.API_PATH_V1
  ? `${process.env.URL_API_TYG_INVESTMENTS}/${process.env.API_PATH_V1}`
  : '';

export async function getAuthToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session?.token?.accessToken) {
    console.log('Not authorized', 'Authorization token not found');
    return null;
  }

  return session.token.accessToken;
}

async function handleResponse(response: Response): Promise<BaseCurrency> {
  if (!response.ok) {
    const error = await response.json();
    throw {
      code: response.status,
      message: error.message || 'An error occurred',
      details: `Error fetching Available Currencies data from ${response.url}`,
    } as HandledError;
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
      throw {
        code: 401,
        message: 'Não autorizado',
        details: 'Authorization token not found in cookies',
      } as HandledError;
    }

    const response = await fetch(`${API_URL}/currencies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {

      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        code: response.status,
        message: errorData.message || 'Failed to fetch currency',
        details: `Error fetching currency from ${response.url}`,
      } as HandledError;
    }

    return handleResponse(response);
  } catch (error) {
    console.error('Currency service error:', error);
    throw error as HandledError;
  }
}

async function handleHistoryResponse(response: Response): Promise<CurrencyQuotationHistoryDto[]> {
  if (!response.ok) {
    const error = await response.json();
    throw {
      code: response.status,
      message: error.message || 'An error occurred',
      details: `Error fetching CurrencyHistory data from ${response.url}`,
    } as HandledError;
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
      throw {
        code: 401,
        message: 'Não autorizado',
        details: 'Authorization token not found in cookies',
      } as HandledError;
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
      const errorData = await response.json();
      throw {
        code: response.status,
        message: errorData.message || 'Failed to fetch history currency',
        details: `Error fetching ahistory currency from ${response.url}`,
      } as HandledError;
    }

    return handleHistoryResponse(response);
  } catch (error) {
    console.error(`Currency history service error for ${code}:`, error);
    throw error as HandledError;
  }
}

async function handleAvaliableCurrenciesResponse(response: Response): Promise<AvailableCurrency[]> {
  if (!response.ok) {
    const error = await response.json();
    throw {
      code: response.status,
      message: error.message || 'An error occurred',
      details: `Error fetching Available Currencies data from ${response.url}`,
    } as HandledError;
  }

  const data = await response.json();

  return data.map((availableCurrency: AvailableCurrency) => ({
    code: availableCurrency.code,
    description: availableCurrency.description,
  }));
}

export async function getAvailableCurrenciesData(): Promise<AvailableCurrency[]> {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw {
        code: 401,
        message: 'Não autorizado',
        details: 'Authorization token not found in cookies',
      } as HandledError;
    }

    const response = await fetch(`${API_URL}/currencies/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 84600, // cache de 1 dia
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        code: response.status,
        message: errorData.message || 'Failed to fetch available currencies',
        details: `Error fetching available currencies from ${response.url}`,
      } as HandledError;
    }

    return handleAvaliableCurrenciesResponse(response);
  } catch (error) {
    console.error('Currency service error:', error);
    throw error;
  }
}



