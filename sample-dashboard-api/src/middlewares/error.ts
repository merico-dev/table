import { QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';
import {
  ApiError, SERVER_ERROR, BAD_REQUEST, ErrorStatusCode, VALIDATION_FAILED
} from '../utils/errors';

export default async function errorHandler(err, req, res, next) {
    let error: ApiError = err;
    let status = 500;
    if (err instanceof ApiError) {
        status = ErrorStatusCode[err.code] || 400;
    } else if (err instanceof QueryFailedError) {
        error = new ApiError(BAD_REQUEST, {
            message: err.message,
        });
    } else if (err instanceof Array && err[0] instanceof ValidationError) {
        error = new ApiError(VALIDATION_FAILED, {
            message: JSON.stringify(err),
        })
    } else {
        error = new ApiError(SERVER_ERROR, { message: err.message });
    }
    res.status(status);
    res.send(error);
}
