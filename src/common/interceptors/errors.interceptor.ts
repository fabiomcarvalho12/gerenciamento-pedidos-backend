import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { EntityNotExistError } from '../errors/entity-not-exist.error';
import { UnprocessableEntityError } from '../errors/unprocessable-entity.error';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityNotExistError) {
          throw new NotFoundException(error.message);
        }

        if (error instanceof UnprocessableEntityError) {
          throw new UnprocessableEntityException(error.message);
        }

        throw error;
      }),
    );
  }
}
