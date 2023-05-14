import { INestApplication } from '@nestjs/common';
import { ErrorExceptionFilter, ErrorFilter, HttpExceptionFilter, OAuthExceptionFilter } from './exception.filter';
import { ApiConfigService } from '../modules/api-config/api.config.service';

/**
 * Exception filter setup
 * @param app
 */
export function exceptionFilterSetup(app: INestApplication) {
  const clientUrl = app.get(ApiConfigService).CLIENT_URL;
  app.useGlobalFilters(
    new ErrorFilter(),
    new HttpExceptionFilter(),
    new ErrorExceptionFilter(clientUrl),
    new OAuthExceptionFilter(clientUrl),
  );
}
