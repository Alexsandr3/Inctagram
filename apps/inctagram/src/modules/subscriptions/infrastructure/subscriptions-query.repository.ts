import { PrismaService } from '../../../providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  ActiveSubscriptionViewModel,
  CurrentActiveSubscriptionsViewModel,
} from '../api/view-model/current-subscriptions-view.dto';
import { PaymentsViewModel } from '../api/view-model/payments-view.dto';
import { StatusSubscriptionType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

/**
 * Abstract class that represents the repository of the subscriptions.
 * ['getCurrentSubscriptions', 'getMyPayments']
 */
export abstract class ISubscriptionsQueryRepository {
  abstract getCurrentSubscriptions(userId: number): Promise<CurrentActiveSubscriptionsViewModel>;
  abstract getMyPayments(userId: number): Promise<PaymentsViewModel[]>;
}
@Injectable()
export class SubscriptionsQueryRepository implements ISubscriptionsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentSubscriptions(userId: number): Promise<CurrentActiveSubscriptionsViewModel> {
    if (!userId) return new CurrentActiveSubscriptionsViewModel([]);
    //get current active subscriptions
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        businessAccountId: userId,
        status: StatusSubscriptionType.ACTIVE,
      },
      orderBy: { dateOfPayment: 'desc' },
    });
    return new CurrentActiveSubscriptionsViewModel(
      subscriptions.length > 0
        ? [
            new ActiveSubscriptionViewModel(
              subscriptions[0].businessAccountId,
              subscriptions[0].externalSubId,
              subscriptions[0].dateOfPayment,
              subscriptions[0].endDate,
              subscriptions[0].autoRenew,
            ),
          ]
        : [],
      // subscriptions.map(
      //   sub =>
      //     new ActiveSubscriptionViewModel(
      //       sub.businessAccountId,
      //       sub.externalSubId,
      //       sub.dateOfPayment,
      //       sub.endDate,
      //       sub.autoRenew,
      //     ),
      // ),
    );
  }

  async getMyPayments(userId: number): Promise<PaymentsViewModel[]> {
    if (!userId) return [];
    //find all subscriptions for current user
    const subscription = await this.prisma.subscription.findMany({
      where: {
        businessAccountId: userId,
        status: StatusSubscriptionType.ACTIVE,
      },
      include: {
        payments: true,
      },
    });
    const ins = [];
    for (const sub of subscription) {
      ins.push(plainToInstance(PaymentsViewModel, sub));
    }
    return ins.map(
      subscription =>
        new PaymentsViewModel(
          userId,
          subscription.externalSubId,
          subscription.dateOfPayment,
          subscription.endDate,
          subscription.payments[0].amount,
          subscription.type,
          subscription.paymentType,
        ),
    );
  }
}
