// app/api/currencies/save/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getError } from '@/app/errors/ErrorMessages';
import CustomError from '@/app/errors/CustomError';
import { ErrorMessages } from '@/app/errors/ErrorMessages';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession( authOptions);

    if (!session?.token?.accessToken) {
      const error = getError('Unauthorized');
      throw new CustomError(error);
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string' || code.trim() === '') {
      const error = getError('InvalidCurrencyCode');
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
        ...error
      });
    }

    // Fazer a requisição POST para a sua API externa
    const response = await fetch(`${API_URL}/currencies`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.token.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ code: code.trim() }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Mapear o erro recebido do backend para o erro pré-definido
      const errorKey = mapBackendErrorCodeToErrorKey(responseData.errorCode);
      const error = getError(errorKey);
      throw new CustomError({
        ...error,
        errorSource: responseData.errorSource || 'BACKEND',
        errorPath: responseData.errorPath || 'API Route: currencies/save',
        errorTimestamp: responseData.errorTimestamp || new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { message: 'Moeda adicionada com sucesso!' },
      { status: 200 }
    );
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
        { status: error.httpStatus }
      );
    } else {
      const errorInfo = getError('InternalServerError');
      return NextResponse.json(
        {
          errorCode: errorInfo.errorCode,
          errorMessage: errorInfo.message,
          errorSource: 'SERVER',
          errorPath: 'API Route: currencies/save',
          errorTimestamp: new Date().toISOString(),
        },
        { status: errorInfo.httpStatus }
      );
    }
  }
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
