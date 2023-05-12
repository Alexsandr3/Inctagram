import { INestApplication } from '@nestjs/common';
import { ErrorExceptionFilter, ErrorFilter, HttpExceptionFilter, OAuthExceptionFilter } from './exception.filter';

/**
 * Exception filter setup
 * @param app
 */
export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(
    new ErrorFilter(),
    new HttpExceptionFilter(),
    new ErrorExceptionFilter(),
    new OAuthExceptionFilter(),
  );
}
