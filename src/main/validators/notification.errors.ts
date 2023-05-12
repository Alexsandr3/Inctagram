import { ResultNotification } from './result-notification';

export class NotificationErrors<T = null> extends Error {
  constructor(message: string, public resultNotification: ResultNotification<T>) {
    super(message);
  }
}
