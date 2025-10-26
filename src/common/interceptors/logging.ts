import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'; 

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    // Inject logger của Winston (được tạo ở AppModule)
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const { method, originalUrl } = req;
    const user = req.user ? `userId=${req.user.id}` : 'user=anonymous';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - start;
        this.logger.log(
          `${method},${originalUrl},${res.statusCode},${delay}ms,SUCCESS,${user}`,
          'HTTP', // context name
        );
      }),
      catchError((err) => {
        const delay = Date.now() - start;
        this.logger.error(
          `${method},${originalUrl},${res.statusCode || 500},${delay}ms,FAIL: ${
            err.message
          },${user}`,
          'HTTP',
        );
        return throwError(() => err);
      }),
    );
  }
}
