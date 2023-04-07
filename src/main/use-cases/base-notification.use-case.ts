import { ResultNotification } from '../validators/result-notification';
import { CheckerNotificationErrors } from '../validators/checker-notification.errors';

export abstract class BaseNotificationUseCase<TCommand, TResult> {
  /**
   *
   * @param command
   */
  async execute(command: TCommand): Promise<ResultNotification<TResult>> {
    //prepare a notification for result
    const notification = new ResultNotification<TResult>();
    try {
      const result = await this.executeUseCase(command);
      if (result) notification.addData(result);
    } catch (e) {
      notification.addErrorFromNotificationException(e);
    }

    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);

    return notification;
  }

  abstract executeUseCase(command: TCommand): Promise<TResult>;
}
