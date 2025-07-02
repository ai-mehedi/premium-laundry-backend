import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (!(exception instanceof HttpException)) {
      console.error('Unhandled exception:', exception);
      if (request.headers['content-type'] !== 'application/json') {
        return response.render('errors/internal-server-error', {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          title: 'Internal server error',
          message: 'Internal server error',
        });
      } else {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        });
      }
    }

    const status = exception?.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse: any = exception.getResponse();

    if (request.headers['content-type'] !== 'application/json') {
      let errorView = 'errors/index';

      if (status === HttpStatus.NOT_FOUND) {
        errorView = 'errors/not-found';
      } else if (status === HttpStatus.UNAUTHORIZED) {
        errorView = 'errors/unauthorized';
      } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        errorView = 'errors/internal-server-error';
      } else if (status === HttpStatus.BAD_REQUEST) {
        errorView = 'errors/bad-request';
      } else if (status === HttpStatus.FORBIDDEN) {
        errorView = 'errors/forbidden';
      }

      if (exceptionResponse?.continue?.redirect) {
        return response.redirect(exceptionResponse?.continue?.redirect);
      }

      let message = '';
      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          message = 'Unauthorized';
          break;
        case HttpStatus.BAD_REQUEST:
          message = 'Bad Request';
          break;
        case HttpStatus.NOT_FOUND:
          message = 'Not Found';
          break;
        case HttpStatus.FORBIDDEN:
          message = 'Forbidden';
          break;
        default:
          message = 'Internal Server Error';
      }

      return response.render(errorView, {
        statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception?.message || message,
        title: message,
        ...(exceptionResponse?.errors
          ? { errors: exceptionResponse?.errors }
          : {}),
        ...(exceptionResponse?.field
          ? {
              errors: [
                {
                  field: exceptionResponse.field,
                  message: exceptionResponse.message,
                },
              ],
            }
          : {}),
        ...(exceptionResponse?.state ? { state: exceptionResponse.state } : {}),
      });
    }

    response.status(status).json({
      statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal server error',
      ...(exceptionResponse?.field
        ? {
            errors: [
              {
                field: exceptionResponse.field,
                message: exceptionResponse.message,
              },
            ],
          }
        : {}),
      ...(exceptionResponse?.errors
        ? { errors: exceptionResponse.errors }
        : {}),
      ...(exceptionResponse?.state ? { state: exceptionResponse.state } : {}),
    });
  }
}
