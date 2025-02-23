import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseValue =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Logowanie błędu z dodatkową informacją o stack trace (jeśli dostępne)
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(responseValue)}`,
      (exception as any)?.stack || '',
    );

    // Opcjonalnie możesz zwrócić stack trace, jeśli aplikacja nie jest w trybie produkcyjnym:
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: responseValue,
      // stack: process.env.NODE_ENV !== 'production' ? (exception as any).stack : undefined,
    };

    response.status(status).json(errorResponse);
  }
}
