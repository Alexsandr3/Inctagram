import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { CheckerNotificationErrors } from '../main/walidators/checker-notification.errors';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    switch (status) {
      case 400:
        const errorResponse = [];
        const responseBody: any = exception.getResponse();
        try {
          if (Array.isArray(responseBody.message)) {
            responseBody.message.forEach(m => errorResponse.push(m));
          }
          const messages = {
            message: responseBody.message,
            field: responseBody.error,
          };
          response.status(status).json({
            statusCode: status,
            messages: errorResponse.length > 0 ? errorResponse : [messages],
            error: 'Bad Request',
          });
        } catch (e) {
          return response.status(status).json({
            statusCode: status,
            messages: [responseBody],
            error: typeof responseBody === 'string' ? responseBody : 'Bad Request',
          });
        }
        break;
      default:
        return response.status(status).json({
          statusCode: status,
          error: exception.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}

enum NotificationCode {
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
    return response.status(statusCode).json(exception.resultNotification);
  }
}
