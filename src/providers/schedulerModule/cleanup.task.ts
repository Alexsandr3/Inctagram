import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CleanupService } from './cleanup.service';

@Injectable()
export class CleanupTask {
  constructor(private readonly cleanupService: CleanupService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handlerUnsuccessfulSubscriptions() {
    //remove unsuccessful subscriptions with payment where status pending and created_at is older than 10 minutes
    const tenMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);
    await this.cleanupService.cleanupUnsuccessfulSubscriptions(tenMinuteAgo);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handlerCheckActiveSubscriptions() {
    //check active subscriptions where endDate is equal to current date
    const currentDate = new Date();
    await this.cleanupService.checkActiveSubscriptions(currentDate);
  }
}
