import { INestApplication } from '@nestjs/common';
import { ErrorExceptionFilter, ErrorFilter, HttpExceptionFilter } from './exception.filter';

/**
 * Exception filter setup
 * @param app
 */
export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(new ErrorFilter(), new HttpExceptionFilter(), new ErrorExceptionFilter());
}
