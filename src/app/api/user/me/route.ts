import { User } from '@/app/types/User';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getError } from '@/app/errors/ErrorMessages';
import CustomError from '@/app/errors/CustomError';

interface ApiError {
  message: string;
  errorCode?: string | number;
}

// Tipo para representar o resultado da função
type GetUserInfoResult = {
  user?: User;
  error?: CustomError;
};

async function getUserInfo(): Promise<GetUserInfoResult> {

  try {
    const session = await getServerSession(authOptions);

    if (!session?.token?.accessToken) {

      return {
        error: new CustomError({
          ...getError('Unauthorized'),
          errorPath: 'getUserInfo',
        }),
      };
    }

    const API_URL = process.env.URL_API_TYG_INVESTMENTS && process.env.API_PATH_V1
      ? `${process.env.URL_API_TYG_INVESTMENTS}/${process.env.API_PATH_V1}`
      : '';

    if (!API_URL) {
      return {
        error: new CustomError({
          ...getError('RequestUrlMalformed'),
          errorPath: 'getUserInfo',
        }),
      };
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token.accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Unknown error',
      }));

      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      const errorInfo = getError('RequestFailed');
      return {
        error: new CustomError({
          errorCode: errorInfo.errorCode,
          message: errorInfo.message,
          httpStatus: errorInfo.httpStatus,
          errorSource: 'API',
          errorPath: 'getUserInfo',
          errorTimestamp: new Date().toISOString(),
        }),
      };
    }

    const userInfo: User = await response.json();

    if (!userInfo.tenantId || !userInfo.name) {
      return {
        error: new CustomError({
          ...getError('RequestFailed'),
          errorPath: 'getUserInfo',
        }),
      };
    }

    return {
      user: {
        tenantId: userInfo. tenantId,
        name: userInfo.name,
        email: userInfo.email,
        settings: userInfo.settings,
      },
    };

  } catch (error) {
    console.error('Error getting user info:', error);

    return {
      error: new CustomError({
        ...getError('InternalServerError'),
        errorPath: 'getUserInfo',
        originalError: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

// Exemplo de uso em uma rota API
export async function GET() {
  const result = await getUserInfo();

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error.httpStatus || 500 },
    );
  }

  return NextResponse.json(result.user);
}