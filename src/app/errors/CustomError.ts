// app/errors/CustomError.ts
import { ErrorInfo } from '@/app/errors/ErrorMessages';

// Interface base para parâmetros do erro
interface BaseErrorParams {
  message: string;
  httpStatus: number;
  errorCode: number;
  errorSource?: string;
  errorPath?: string;
  errorTimestamp?: string;
  originalError?: Error;
  metadata?: Record<string, unknown>;
}

// Interface para o construtor completo
interface CustomErrorParams extends BaseErrorParams {
  errorSource?: string;
  errorPath?: string;
  errorTimestamp?: string;
}

// Interface para o construtor parcial
type PartialErrorParams = Partial<ErrorInfo> & {
  errorSource?: string;
  errorPath?: string;
  errorTimestamp?: string;
};

export default class CustomError extends Error {
  readonly errorCode: number;
  readonly errorSource: string;
  readonly errorPath: string;
  readonly errorTimestamp: string;
  readonly httpStatus: number;
  readonly originalError?: Error;
  readonly metadata?: Record<string, unknown>;

  // Sobrecarga dos construtores
  constructor(errorInfo: PartialErrorParams);
  constructor(params: CustomErrorParams);
  constructor(params: unknown) {
    // Verificação do tipo de parâmetro para determinar qual construtor usar
    if (params && typeof params === 'object') {
      const errorParams = params as CustomErrorParams | PartialErrorParams;

      // Chama o construtor do Error com a mensagem
      super(errorParams.message || 'An unknown error occurred');

      // Atribui valores com fallbacks
      this.errorCode = errorParams.errorCode || 500;
      this.errorSource = errorParams.errorSource || 'APPLICATION';
      this.errorPath = errorParams.errorPath || '';
      this.errorTimestamp = errorParams.errorTimestamp || new Date().toISOString();
      this.httpStatus = errorParams.httpStatus || 500;
      this.originalError = (errorParams as CustomErrorParams).originalError;
      this.metadata = (errorParams as CustomErrorParams).metadata;
    } else {
      // Construtor padrão
      super('An unknown error occurred');
      this.errorCode = 500;
      this.errorSource = 'APPLICATION';
      this.errorPath = '';
      this.errorTimestamp = new Date().toISOString();
      this.httpStatus = 500;
    }

    // Mantém o protótipo correto em transpilação
    Object.setPrototypeOf(this, CustomError.prototype);

    // Captura o stack trace
    Error.captureStackTrace(this, this.constructor);

    // Nome da classe para identificação
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      errorSource: this.errorSource,
      errorPath: this.errorPath,
      errorTimestamp: this.errorTimestamp,
      httpStatus: this.httpStatus,
      metadata: this.metadata,
      stack: this.stack,
      originalError: this.originalError ? {
        message: this.originalError.message,
        stack: this.originalError.stack
      } : undefined
    };
  }

  toString() {
    return `${this.name}: [${this.errorCode}] ${this.message} (${this.errorSource} - ${this.errorPath})`;
  }

  static fromError(error: Error | unknown, params: PartialErrorParams = {}): CustomError {
    if (error instanceof CustomError) {
      return error;
    }

    const isErrorInstance = error instanceof Error;

    return new CustomError({
      message: isErrorInstance ? error.message : String(error),
      errorCode: params.errorCode || 500,
      httpStatus: params.httpStatus || 500,
      errorSource: params.errorSource || 'APPLICATION',
      errorPath: params.errorPath || '',
      errorTimestamp: params.errorTimestamp || new Date().toISOString(),
      originalError: isErrorInstance ? error as Error : undefined,
      metadata: (params as CustomErrorParams).metadata
    });
  }
}