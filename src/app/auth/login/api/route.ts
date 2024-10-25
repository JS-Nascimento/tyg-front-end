// /app/auth/login/api/route.ts
import { loginFormSchema } from '@/app/lib/validations/LoginValidation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = loginFormSchema.parse(await request.json());
    // Implemente a lógica para obter o token e armazená-lo em cookies se necessário
    return new NextResponse('It works');
  } catch (err: any) {
    return new NextResponse(err.message, { status: 400 });
  }
}
