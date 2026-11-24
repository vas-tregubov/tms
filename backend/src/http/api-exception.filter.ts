import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

import type { ApiError } from './api-error';
import { RequestValidationException } from './request-validation.pipe';

// Recognize only body-parser's known client error types and matching statuses.
// An arbitrary exception's status/statusCode alone is not trusted.
const parserErrorStatus = (exception: unknown): HttpStatus | undefined => {
  if (!(exception instanceof Error)) return;
  const error = exception as Error & {
    type?: unknown;
    status?: unknown;
    statusCode?: unknown;
  };
  let status: HttpStatus;
  switch (error.type) {
    case 'entity.too.large':
      status = HttpStatus.PAYLOAD_TOO_LARGE;
      break;
    case 'charset.unsupported':
    case 'encoding.unsupported':
      status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      break;
    case 'entity.parse.failed':
    case 'request.aborted':
    case 'request.size.invalid':
      status = HttpStatus.BAD_REQUEST;
      break;
    default:
      return;
  }
  if (error.status === status && error.statusCode === status) return status;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : (parserErrorStatus(exception) ?? HttpStatus.INTERNAL_SERVER_ERROR);
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const category =
        exception instanceof HttpException
          ? 'HTTP exception'
          : 'unexpected exception';
      this.logger.error(`HTTP request failed: ${category}; status=${status}`);
    }
    let body: ApiError;
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        if (exception instanceof RequestValidationException) {
          body = {
            code: 'VALIDATION_ERROR',
            message: 'The request contains invalid fields.',
          };
          if (exception.details.length) body.details = exception.details;
        } else {
          body = {
            code: 'BAD_REQUEST',
            message: 'The request could not be processed.',
          };
        }
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
