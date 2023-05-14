import { PrismaService } from '../../../providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  ActiveSubscriptionViewModel,
  CurrentActiveSubscriptionsViewModel,
} from '../api/view-model/current-subscriptions-view.dto';
import { PaymentsViewModel } from '../api/view-model/payments-view.dto';
import { StatusSubscriptionType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

export abstract class ISubscriptionsQueryRepository {
  abstract getCurrentSubscriptions(userId: number): Promise<CurrentActiveSubscriptionsViewModel>;
  abstract getMyPayments(userId: number): Promise<PaymentsViewModel[]>;
}
@Injectable()
export class SubscriptionsQueryRepository implements ISubscriptionsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentSubscriptions(userId: number): Promise<CurrentActiveSubscriptionsViewModel> {
    //get current active subscriptions
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        businessAccountId: userId,
        status: StatusSubscriptionType.ACTIVE,
      },
    });
    return new CurrentActiveSubscriptionsViewModel(
      subscriptions.map(
        sub =>
          new ActiveSubscriptionViewModel(
            sub.businessAccountId,
            sub.externalSubId,
            sub.startDate,
            sub.endDate,
            sub.autoRenew,
          ),
      ),
    );
  }

  async getMyPayments(userId: number): Promise<PaymentsViewModel[]> {
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
