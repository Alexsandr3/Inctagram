import { INestApplication } from '@nestjs/common';

/**
 * Exception filter setup
 * @param app
 */
export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters();
}
