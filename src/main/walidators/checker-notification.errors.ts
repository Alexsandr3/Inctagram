import { ResultNotification } from './result-notification';

export class CheckerNotificationErrors extends Error {
  constructor(message: string, public resultNotification: ResultNotification) {
    super(message);
  }
}
