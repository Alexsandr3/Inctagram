import { INestApplication } from '@nestjs/common';
import { ErrorExceptionFilter, HttpExceptionFilter } from './exception.filter';

/**
 * Exception filter setup
 * @param app
 */
export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter(), new ErrorExceptionFilter());
}
