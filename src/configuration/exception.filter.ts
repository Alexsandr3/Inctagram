import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CheckerNotificationErrors } from '../main/validators/checker-notification.errors';
import { ApiErrorResultDto } from '../main/validators/api-error-result.dto';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
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

export enum NotificationCode {
  OK = 0,
  NOT_FOUND = 1,
  BAD_REQUEST = 2,
  UNAUTHORIZED = 3,
  FORBIDDEN = 4,
  SERVER_ERROR = 5,
}

@Catch(CheckerNotificationErrors)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: CheckerNotificationErrors, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const codeMap = {
      [NotificationCode.OK]: 200,
      [NotificationCode.NOT_FOUND]: 404,
      [NotificationCode.BAD_REQUEST]: 400,
      [NotificationCode.UNAUTHORIZED]: 401,
      [NotificationCode.FORBIDDEN]: 403,
      [NotificationCode.SERVER_ERROR]: 500,
    };
    const statusCode = codeMap[exception.resultNotification.getCode()] || 500;
    const errorResult = new ApiErrorResultDto();
    errorResult.statusCode = statusCode;
    errorResult.messages = mapErrorsToNotification(exception.resultNotification.extensions);
    errorResult.error = NotificationCode[exception.resultNotification.getCode()];
    return response.status(statusCode).json(errorResult);
  }
}

export function mapErrorsToNotification(errors: any[]) {
  const errorResponse = [];
  errors.forEach((item: any) => errorResponse.push({ message: item.message, field: item.field }));
  return errorResponse;
}

/* const errors = {
  400: {
    messages: mapErrorsToNotification(responseBody.message),
    error: 'Bad Request',
  },
  401: {
    messages: [{ message: 'Unauthorized', field: 'not today' }],
    error: 'Unauthorized',
  },
};
const errorResult = new ApiErrorResultDto();
errorResult.statusCode = status;
errorResult.messages = errors[status]?.messages || [];
errorResult.error = errors[status]?.error || exception.message;

console.log('errorResult', errorResult);*/
