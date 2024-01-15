import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';
import { ApiError, SERVER_ERROR, BAD_REQUEST, ErrorStatusCode, VALIDATION_FAILED, NOT_FOUND } from '../utils/errors';
import log, { LOG_LABELS, LOG_LEVELS } from '../utils/logger';

export default async function errorHandler(err, req, res, next) {
  let error: ApiError = err;
  let status = 500;
  if (err instanceof ApiError) {
    status = ErrorStatusCode[err.code] || 400;
  } else if (err instanceof QueryFailedError) {
    error = new ApiError(BAD_REQUEST, {
      message: err.message,
      detail: err.driverError.detail,
    });
  } else if (err instanceof EntityNotFoundError) {
    status = ErrorStatusCode[NOT_FOUND];
    error = new ApiError(NOT_FOUND, {
      message: err.message,
    });
  } else if (err instanceof Array && err[0] instanceof ValidationError) {
    status = ErrorStatusCode[VALIDATION_FAILED];
    error = new ApiError(VALIDATION_FAILED, {
      message: JSON.stringify(err),
    });
  } else {
    error = new ApiError(SERVER_ERROR, {
      message: err.message,
    });
  }
  log(LOG_LEVELS.ERROR, LOG_LABELS.API, `${status}: ${error}`);
  res.status(status);
  res.send(error);
}
