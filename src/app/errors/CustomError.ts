// app/errors/CustomError.ts

import { ErrorInfo } from '@/app/errors/ErrorMessages';
export default class CustomError extends Error {
  errorCode: number;
  errorSource: string;
  errorPath: string;
  errorTimestamp: string;
  httpStatus: number;

  constructor(errorInfo: Partial<ErrorInfo> & { errorSource?: string; errorPath?: string; errorTimestamp?: string }) {
    super(errorInfo.message);
    this.errorCode = errorInfo.errorCode || 0;
    this.errorSource = errorInfo.errorSource || 'APPLICATION';
    this.errorPath = errorInfo.errorPath || '';
    this.errorTimestamp = errorInfo.errorTimestamp || new Date().toISOString();
    this.httpStatus = errorInfo.httpStatus || 500;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
