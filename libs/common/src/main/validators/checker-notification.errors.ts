import { ResultNotification } from './result-notification';

export class NotificationErrors<T = null> extends Error {
  constructor(public resultNotification: ResultNotification<T>) {
    super('NotificationErrors');
  }
}
