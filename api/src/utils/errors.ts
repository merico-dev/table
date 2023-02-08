export const BAD_REQUEST = 'BAD_REQUEST';
export const NOT_FOUND = 'NOT_FOUND';
export const SERVER_ERROR = 'SERVER_ERROR';
export const VALIDATION_FAILED = 'VALIDATION_FAILED';
export const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';
export const PASSWORD_MISMATCH = 'PASSWORD_MISMATCH';
export const UNAUTHORIZED = 'UNAUTHORIZED';
export const FORBIDDEN = 'FORBIDDEN';
export const AUTH_NOT_ENABLED = 'AUTH_NOT_ENABLED';

export interface ErrorDetail {
  [index: string]: any;
  message?: string;
}

export class ApiError extends Error {
  public code: string;

  public detail?: ErrorDetail;

  constructor(code: string, detail?: ErrorDetail) {
    super();
    this.code = code;
    this.detail = detail;
  }

  get message() {
    return `${this.code}: ${(this.detail && this.detail.message) || ''}`;
  }
}

export const ErrorStatusCode = {
  [BAD_REQUEST]: 400,
  [VALIDATION_FAILED]: 400,
  [PASSWORD_MISMATCH]: 400,
  [AUTH_NOT_ENABLED]: 400,
  [INVALID_CREDENTIALS]: 401,
  [UNAUTHORIZED]: 401,
  [FORBIDDEN]: 403,
  [NOT_FOUND]: 404,
};
