// app/api/currencies/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { ErrorMessages, getError } from '@/app/errors/ErrorMessages';
import CustomError from '@/app/errors/CustomError';
import { BaseCurrency, Currency } from '@/app/interfaces/BaseCurrency';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token?.accessToken) {
      const error = getError('Unauthorized');
      throw new CustomError(error);
    }

    // Construir a URL da API
    const API_URL =
      process.env.URL_API_TYG_INVESTMENTS && process.env.API_PATH_V1
        ? `${process.env.URL_API_TYG_INVESTMENTS}/${process.env.API_PATH_V1}`
        : '';

    if (!API_URL) {
      const error = getError('RequestUrlMalformed');
      throw new CustomError({
        ...error,
      });
    }

    // Fazer a requisição GET para a sua API externa
    const response = await fetch(`${API_URL}/currencies`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.token.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorKey = mapBackendErrorCodeToErrorKey(responseData.errorCode);
      const error = getError(errorKey);
      throw new CustomError({
        ...error,
        errorSource: responseData.errorSource || 'BACKEND',
        errorPath: responseData.errorPath || 'API Route: currencies/save',
        errorTimestamp: responseData.errorTimestamp || new Date().toISOString(),
      });
    }

    // Transform the data into the expected format
    const transformedData = transformCurrencyData(responseData);

    // Return the transformed data with NextResponse
    return NextResponse.json(transformedData);

  } catch (error) {
    console.error('Error in save currency API route:', error);

    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          errorCode: error.errorCode,
          errorMessage: error.message,
          errorSource: error.errorSource,
          errorPath: error.errorPath,
          errorTimestamp: error.errorTimestamp,
        },
        { status: error.httpStatus },
      );
    } else {
      const errorInfo = getError('InternalServerError');
      return NextResponse.json(
        {
          errorCode: errorInfo.errorCode,
          errorMessage: errorInfo.message,
          errorSource: 'SERVER',
          errorPath: 'API Route: /currencies',
          errorTimestamp: new Date().toISOString(),
        },
        { status: errorInfo.httpStatus },
      );
    }
  }
}

function transformCurrencyData(data: BaseCurrency): BaseCurrency {
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

function mapBackendErrorCodeToErrorKey(backendErrorCode: number): keyof typeof ErrorMessages {
  switch (backendErrorCode) {
    case 1008:
      return 'CurrencyNameNull';
    case 1009:
      return 'CurrencyAlreadyExists';
    case 1010:
      return 'InvalidCurrencyCode';
    default:
      return 'InternalServerError';
  }
}