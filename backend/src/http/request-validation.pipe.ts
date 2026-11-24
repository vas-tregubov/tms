import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

import type { ValidationDetail } from './api-error';

// A typed Nest HTTP exception lets the filter distinguish our safe details from
// arbitrary exception bodies. Validator messages/values are never forwarded.
export class RequestValidationException extends BadRequestException {
  constructor(readonly details: ValidationDetail[]) {
    super('The request contains invalid fields.');
  }
}

const validationDetails = (
  errors: ValidationError[],
  parent = '',
): ValidationDetail[] =>
  errors.flatMap((error) => {
    const property = error.property || '$';
    const field = !parent
      ? property
      : /^\d+$/.test(property)
        ? `${parent}[${property}]`
        : `${parent}.${property}`;
    const constraints = error.constraints ?? {};
    const details: ValidationDetail[] = [];
    if (Object.keys(constraints).length) {
      const unknown = 'whitelistValidation' in constraints;
      const missing = 'isDefined' in constraints;
      details.push({
        field,
        code: unknown
          ? 'UNKNOWN_PROPERTY'
          : missing
            ? 'REQUIRED_FIELD'
            : 'INVALID_VALUE',
        message: unknown
          ? 'Unknown property.'
          : missing
            ? 'This field is required.'
            : 'The field is invalid.',
      });
    }
    return [...details, ...validationDetails(error.children ?? [], field)];
  });

export const createRequestValidationPipe = (): ValidationPipe =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
    validationError: { target: false, value: false },
    exceptionFactory: (errors) =>
      new RequestValidationException(validationDetails(errors)),
  });
