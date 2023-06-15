import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { NotificationCode } from '@common/configuration/notificationCode';

/**
 * Result Notification is a class for response with status code, messages and data ['success'=0, 'error'=1]
 */
export enum NotificationStatus {
  SUCCESS = 0,
  ERROR = 1,
}

export class ResultNotification<T = null> {
  extensions: NotificationExtension[] = []; // array of mistakes
  status: NotificationStatus = NotificationStatus.SUCCESS; // status code {0 - success, 1 - error}
  code: NotificationCode = NotificationCode.OK;
  data: T | null = null; // data for response

  static success<T>(data) {
    const not = new ResultNotification<T>();
    not.addData(data);
  }

  static error(
    message: string, // message for mistake
    key: string | null = null,
    code: NotificationCode | null = null, //status code
  ): ResultNotification {
    const not = new ResultNotification();
    not.addError(message, key, code);
    return not;
  }

  hasError() {
    return this.code !== 0;
  }

  addError(
    message: string, // message for mistake
    key: string | null = null,
    code: NotificationCode | null = null, //status code
  ) {
    this.code = code ?? NotificationCode.BAD_REQUEST;
    this.status = NotificationStatus.ERROR;
    this.extensions.push(new NotificationExtension(message, key));
  }

  addData(data: T) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  getCode() {
    return this.code;
  }

  addErrorFromNotificationException(e: NotificationException) {
    this.code = e.code ?? NotificationCode.BAD_REQUEST;
    this.extensions.push(new NotificationExtension(e.message, e.key));
  }
}

export class NotificationExtension {
  public message: string;
  public field: string | null;
  public code: HTTP_Status;

  constructor(message: string, field: string | null) {
    this.field = field;
    this.message = message;
  }
}

export class NotificationException {
  constructor(public message: string, public key: string, public code: NotificationCode) {}
}