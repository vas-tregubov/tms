import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

import type { ApiError } from './api-error';
import { RequestValidationException } from './request-validation.pipe';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let body: ApiError;
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        body = {
          code: 'VALIDATION_ERROR',
          message: 'The request contains invalid fields.',
        };
        if (
          exception instanceof RequestValidationException &&
          exception.details.length
        )
          body.details = exception.details;
        break;
      case HttpStatus.NOT_FOUND:
        body = {
          code: 'RESOURCE_NOT_FOUND',
          message: 'The requested resource was not found.',
        };
        break;
      case HttpStatus.CONFLICT:
        body = {
          code: 'BUSINESS_CONFLICT',
          message: 'The request conflicts with the current resource state.',
        };
        break;
      default:
        body =
          status >= HttpStatus.INTERNAL_SERVER_ERROR
            ? {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred.',
              }
            : {
                code: 'HTTP_ERROR',
                message: 'The request could not be completed.',
              };
    }
    // Do not forward exception messages, response objects, SQL or stack traces.
    host.switchToHttp().getResponse<Response>().status(status).json(body);
  }
}
