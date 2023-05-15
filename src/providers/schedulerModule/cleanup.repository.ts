import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusSubscriptionType } from '@prisma/client';
import { SubscriptionEntity } from '../../modules/subscriptions/domain/subscription.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CleanupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async removeUnsuccessfulSubscriptions(minuteAgo: Date) {
    //find subscriptions with status pending and created_at is older than 10 minutes
    await this.prisma.$transaction([
      this.prisma.payment.deleteMany({
        where: {
          subscription: {
            status: StatusSubscriptionType.PENDING,
            createdAt: {
              lte: minuteAgo,
            },
          },
        },
      }),
      this.prisma.subscription.deleteMany({
        where: {
          status: StatusSubscriptionType.PENDING,
          createdAt: {
            lte: minuteAgo,
          },
        },
      }),
    ]);
  }

  async getActiveSubscriptionsWithPayments(currentDate: Date): Promise<SubscriptionEntity[]> {
    //get subscriptions where the end date is equal to or less than the current date
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: StatusSubscriptionType.ACTIVE,
        endDate: {
          lte: currentDate,
        },
      },
    });
    return plainToInstance(SubscriptionEntity, subscriptions);
  }

  async saveSubscriptions(subscriptions: SubscriptionEntity[]): Promise<void> {
    await this.prisma.subscription.updateMany({
      where: {
        id: {
          in: subscriptions.map(subscription => subscription.id),
        },
      },
      data: {
        status: StatusSubscriptionType.FINISHED,
        autoRenew: false,
      },
    });
  }
}
