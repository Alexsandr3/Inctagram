import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { OAuthException, OAuthFlowType } from '../main/validators/oauth.exception';
import { Response } from 'express';

@Catch(OAuthException)
export class OAuthExceptionFilter implements ExceptionFilter {
  constructor(private clientUrl) {}

  catch(exception: OAuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.key === OAuthFlowType.Authorization) {
      response.redirect(`${this.clientUrl}/auth/login?status_code=${exception.httpCode}&message=${exception.message}`);
    } else if (exception.key === OAuthFlowType.Registration) {
      response.redirect(
        `${this.clientUrl}/auth/registration?status_code=${exception.httpCode}&message=${exception.message}`,
      );
    }
    return;
  }
}
