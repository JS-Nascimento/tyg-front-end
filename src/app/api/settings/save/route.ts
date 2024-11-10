// app/api/settings/save/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { ErrorMessages, getError } from '@/app/errors/ErrorMessages';
import CustomError from '@/app/errors/CustomError';
import { getSession } from 'next-auth/react';
import { createUserSettingsPayload } from '@/app/mappers/UserSettingsMapper';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession( authOptions);

    if (!session?.token?.accessToken) {
       return { error: getError('Unauthorized') };
    }

    const { data } = await req.json();
    const payload = createUserSettingsPayload(data);

    const API_URL =
      process.env.URL_API_TYG_INVESTMENTS && process.env.API_PATH_V1
        ? `${process.env.URL_API_TYG_INVESTMENTS}/${process.env.API_PATH_V1}`
        : '';

    if (!API_URL) {
     return  getError('RequestUrlMalformed');
    }

    const tenantId = session.user.id;

    const response = await fetch(`${API_URL}/users/settings/${tenantId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.token.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify( payload ),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorKey = mapBackendErrorCodeToErrorKey(responseData.errorCode);
      return getError(errorKey);
    }

    await getSession();

    return NextResponse.json(
      { message: 'Moeda adicionada com sucesso!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in save user settings route:', error);

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
