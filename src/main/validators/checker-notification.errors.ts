import { ResultNotification } from './result-notification';

export class CheckerNotificationErrors<T = null> extends Error {
  constructor(message: string, public resultNotification: ResultNotification<T>) {
    super(message);
  }
}
