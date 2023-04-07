import { ResultNotification } from '../../../../main/validators/result-notification';

export abstract class BaseNotificationUseCase<TCommand, TResult> {
  protected constructor() {}

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
    console.log(notification);
    return notification;
  }

  abstract executeUseCase(command: TCommand): Promise<TResult>;
}
