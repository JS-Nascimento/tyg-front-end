import { loginFormSchema } from '@/app/lib/validations/LoginValidation';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export async function POST(request: NextRequest) {
  try {
    // Validar os dados do formulário
    const formData = await request.json();
    const { email, password } = loginFormSchema.parse(formData);

    // TODO: Implemente sua lógica de autenticação aqui
    // Exemplo de verificação básica (substitua por sua lógica real)
    const isValidUser = await validateUser(email, password);

    if (!isValidUser) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Exemplo de resposta bem-sucedida
    return NextResponse.json(
      {
        message: 'Authentication successful',
        user: { email }  // Não inclua dados sensíveis como senha
      },
      { status: 200 }
    );

  } catch (error) {
    // Tratamento específico para erros de validação do Zod
    if (error instanceof ZodError) {
      const errorResponse: ErrorResponse = {
        message: 'Validation failed',
        errors: error.errors.reduce((acc, curr) => {
          const field = curr.path[0] as string;
          const messages = acc[field] || [];
          acc[field] = [...messages, curr.message];
          return acc;
        }, {} as Record<string, string[]>)
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Tratamento para outros tipos de erro
    console.error('Authentication error:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Função de exemplo para validação de usuário
// Substitua esta implementação pela sua lógica real de autenticação
async function validateUser(email: string, password: string): Promise<boolean> {
  // Aqui você deve implementar sua lógica real de autenticação
  // Por exemplo, verificar credenciais no banco de dados
  // Este é apenas um exemplo

  try {

    return email.includes('@') && password.length >= 6;
  } catch (error) {
    console.error('Error validating user:', error);
    return false;
  }
}