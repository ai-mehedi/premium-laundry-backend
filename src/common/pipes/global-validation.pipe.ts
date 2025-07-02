import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: validationErrors.map((error) => ({
            field: error.property,
            message:
              Object.values(error.constraints || {})[0] || 'Invalid value',
          })),
        });
      },
    });
  }
}
