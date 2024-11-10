// app/api/settings/options/locales/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getError } from '@/app/errors/ErrorMessages';
import CustomError from '@/app/errors/CustomError';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token?.accessToken) {
      throw new CustomError(getError('Unauthorized'));
    }

    const API_URL = `${process.env.URL_API_TYG_INVESTMENTS}/${process.env.API_PATH_V1}/settings/options/locales`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.token.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new CustomError(getError('RequestFailed'));
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in GET request:', error);
    const errorInfo = error instanceof CustomError ? error : getError('InternalServerError');
    return NextResponse.json({
      errorCode: errorInfo.errorCode,
      errorMessage: errorInfo.message,
      errorSource: 'SERVER',
      errorPath: 'API Route: /settings/options/timezones',
      errorTimestamp: new Date().toISOString(),
    }, { status: errorInfo.httpStatus });
  }
}
