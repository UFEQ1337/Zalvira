import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { headers: any }>();
    const method = request.method;
    const url = request.url;

    const correlationId =
      (request.headers['x-correlation-id'] as string) || this.generateId();

    return next.handle().pipe(
      tap((data) => {
        const response = ctx.getResponse();
        const status = response.statusCode;

        this.logger.log(
          `[${correlationId}] ${method} ${url} => ${status} (w ${Date.now() - now}ms)`,
        );
      }),
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
