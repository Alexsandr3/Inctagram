import { ResultNotification } from '../validators/result-notification';
import { CheckerNotificationErrors } from '../validators/checker-notification.errors';
import { Logger } from '@nestjs/common';

export abstract class BaseNotificationUseCase<TCommand, TResult> {
  private readonly logger = new Logger(BaseNotificationUseCase.name);
  /**
   *
   * @param command
   */ w;
  async execute(command: TCommand): Promise<ResultNotification<TResult>> {
    //prepare a notification for result
    const notification = new ResultNotification<TResult>();
    try {
      const result = await this.executeUseCase(command);
      if (result) notification.addData(result);
    } catch (e) {
      notification.addErrorFromNotificationException(e);
      // console.log('BaseNotificationUseCase: ', e);
      this.logger.log('BaseNotificationUseCase:', +JSON.stringify(command));
      this.logger.error(JSON.stringify(e));
    }

    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);

    return notification;
  }

  abstract executeUseCase(command: TCommand): Promise<TResult>;
}
