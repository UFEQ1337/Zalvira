import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request & { headers: any }>();

    const correlationId =
      (request.headers['x-correlation-id'] as string) || 'N/A';

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId,
      statusCode: status,
      error:
        exception.message ||
        (status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : 'Error'),
    };

    this.logger.error(
      `[${correlationId}] ${request.method} ${request.url} => ${status}: ${
        exception.message
      }`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
