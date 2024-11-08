// app/constants/ErrorMessages.ts
export const ErrorMessages = {
  CurrencyNameNull: {
    errorCode: 1008,
    httpStatus: 400,
    message: 'O nome da moeda não pode ser nulo.',
  },
  CurrencyAlreadyExists: {
    errorCode: 1009,
    httpStatus: 409,
    message: 'A moeda já existe no sistema.',
  },
  InvalidCurrencyCode: {
    errorCode: 1010,
    httpStatus: 400,
    message: 'Código de moeda inválido.',
  },
  Unauthorized: {
    errorCode: 2001,
    httpStatus: 401,
    message: 'Não autorizado. Por favor, faça login novamente.',
  },
  InternalServerError: {
    errorCode: 3000,
    httpStatus: 500,
    message: 'Erro interno do servidor. Tente novamente mais tarde.',
  },
  RequestUrlMalformed:{
    errorCode: 1001,
    httpStatus: 400,
    message: 'Url de requisição malformada',
  }

} as const;

type ErrorKey = keyof typeof ErrorMessages;
export type ErrorInfo = typeof ErrorMessages[ErrorKey];

export function getError(errorKey: keyof typeof ErrorMessages): ErrorInfo {
  return ErrorMessages[errorKey];
}

export function getErrorByCode(errorCode: number): ErrorInfo {
  const errorEntry = Object.entries(ErrorMessages).find(
    ([, value]) => value.errorCode === errorCode
  );

  if (errorEntry) {
    return errorEntry[1];
  } else {
    return {
      errorCode: errorCode,
      httpStatus: 500,
      message: 'Ocorreu um erro inesperado.',
    } as unknown as ErrorInfo;
  }
}
