import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResultDto } from '../main/validators/api-error-result.dto';
import { OAuthFlowType } from '../main/validators/oauth.exception';
import { NotificationExtension } from '../main/validators/result-notification';
import { NotificationErrors } from '../main/validators/checker-notification.errors';
import { GraphqlExceptionFilter } from './graphqlException.filter';
import { GraphQLErrorType } from '../main/enums/graphQL-error.type';
import { NotificationCode } from './notificationCode';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error(exception);
    if (process.env.envoirment !== `production`) {
      response.status(500).send({ error: exception.toString(), stack: exception.stack });
    } else {
      response.status(500).send(`some error occurred`);
    }
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();

    const errorResult = new ApiErrorResultDto();
    errorResult.statusCode = status;
    // this.logger.error(exception);
    this.logger.error(JSON.stringify(responseBody));
    if (status === 401) {
      errorResult.messages = [{ message: 'Authorization error', field: 'authorization' }];
      errorResult.error = 'Unauthorized';
      return response.status(status).json(errorResult);
    }
    errorResult.messages = status === 400 ? mapErrorsToNotification(responseBody.message) : [];
    errorResult.error = status === 400 ? 'Bad Request' : exception.message;
    return response.status(status).json(errorResult);
  }
}

@Catch(NotificationErrors)
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(private clientUrl) {}

  catch(exception: NotificationErrors, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const notificationCode = exception.resultNotification.getCode();
    const notificationExtensions = exception.resultNotification.extensions;

    const codeMap = {
      [NotificationCode.OK]: 200,
      [NotificationCode.NOT_FOUND]: 404,
      [NotificationCode.BAD_REQUEST]: 400,
      [NotificationCode.UNAUTHORIZED]: 401,
      [NotificationCode.FORBIDDEN]: 403,
      [NotificationCode.SERVER_ERROR]: 500,
    };
    const statusCode = codeMap[notificationCode] || 500;
    if (
      notificationExtensions.length &&
      notificationExtensions.some(
        e => e.field === OAuthFlowType.Registration || e.field === OAuthFlowType.Authorization,
      )
    )
      return oAuthExceptionHandle(response, notificationExtensions[0], statusCode, this.clientUrl);
    if (notificationExtensions.length && notificationExtensions.some(e => e.field === GraphQLErrorType.graphql))
      throw new GraphqlExceptionFilter(notificationExtensions[0].message, statusCode);
    const errorResult = new ApiErrorResultDto();
    errorResult.statusCode = statusCode;
    errorResult.messages = mapErrorsToNotification(notificationExtensions);
    errorResult.error = NotificationCode[notificationCode];
    return response.status(statusCode).json(errorResult);
  }
}

function oAuthExceptionHandle(
  response: Response,
  exception: NotificationExtension,
  statusCode: number,
  clientUrl: string,
) {
  if (exception.field === OAuthFlowType.Authorization) {
    response.redirect(`${clientUrl}/auth/login?status_code=${statusCode}&message=${exception.message}`);
  } else if (exception.field === OAuthFlowType.Registration) {
    response.redirect(`${clientUrl}/auth/registration?status_code=${statusCode}&message=${exception.message}`);
  }
  return;
}

export function mapErrorsToNotification(errors: any[]) {
  const errorResponse = [];
  errors.forEach((item: any) => errorResponse.push({ message: item.message, field: item.field }));
  return errorResponse;
}
