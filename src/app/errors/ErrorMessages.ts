// app/constants/ErrorMessages.ts
export const ErrorMessages = {
  InvalidCredentials: {
    errorCode: 1001,
    httpStatus: 401,
    message: 'Credenciais inválidas.',
  },
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
  },
  RequestFailed:{
    errorCode: 1002,
    httpStatus: 400,
    message: 'A Requisição não retornou nenhum dado.',
  },
  InvalidBaseCurrency:{
    errorCode: 1003,
    httpStatus: 400,
    message: 'Moeda base inválida.',
  },
  InvalidZoneTime:{
    errorCode: 1004,
    httpStatus: 400,
    message: 'Fuso horário inválido.',
  },
  InvalidLocale:{
    errorCode: 1005,
    httpStatus: 400,
    message: 'Local inválido.',
  },
  InvalidDecimalPlaces:{
    errorCode: 1006,
    httpStatus: 400,
    message: 'Casas decimais inválidas.',
  },
  InvalidCurrencyDecimalPlaces:{
    errorCode: 1007,
    httpStatus: 400,
    message: 'Casas decimais de moeda inválidas.',
  },
  InvalidDarkMode:{
    errorCode: 1008,
    httpStatus: 400,
    message: 'Selecione corretamente o tema .',
  },
  UnexpectedError:{
    errorCode: 1009,
    httpStatus: 500,
    message: 'Erro inesperado.',
  },

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
