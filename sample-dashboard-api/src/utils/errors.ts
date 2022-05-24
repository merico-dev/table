export const BAD_REQUEST = 'BAD_REQUEST';
export const NOT_FOUND = 'NOT_FOUND';
export const SERVER_ERROR = 'SERVER_ERROR';
export const VALIDATION_FAILED = 'VALIDATION_FAILED';

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
    [NOT_FOUND]: 404,
    [VALIDATION_FAILED]: 400,
  };