import { Injectable } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupTask {
  constructor(private readonly cleanupService: CleanupService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handlerUnsuccessfulSubscriptions() {
    //remove unsuccessful Clients with payment where status pending and created_at is older than 10 minutes
    const tenMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);
    await this.cleanupService.cleanupUnsuccessfulSubscriptions(tenMinuteAgo);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handlerCheckActiveSubscriptions() {
    //check active Clients where endDate is equal to current date
    const currentDate = new Date();
    await this.cleanupService.checkActiveSubscriptions(currentDate);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handlerCheckPostWithStatusDeleted() {
    //need delete post with status deleted if status deleted and updated_at is older than 2 days
    const tenDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    await this.cleanupService.removePostWithStatusDeleted(tenDaysAgo);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handlerCheckExpiredSessions() {
    //need delete sessions if exp date less than current date
    //the Date in seconds
    const currentDate = Math.floor(Date.now() / 1000);
    await this.cleanupService.removeExpiredSessions(currentDate);
  }
}
