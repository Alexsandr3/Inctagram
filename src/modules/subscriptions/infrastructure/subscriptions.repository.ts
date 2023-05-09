import { BusinessAccountEntity } from '../domain/business-account.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { SubscriptionEntity } from '../domain/subscription.entity';
import { PaymentEntity } from '../domain/payment.entity';

export abstract class ISubscriptionsRepository {
  abstract findBusinessAccountByUserId(userId: number): Promise<BusinessAccountEntity>;

  abstract saveSubscription(
    subscription: SubscriptionEntity,
    payment: PaymentEntity,
    businessAccount: BusinessAccountEntity,
  );

  abstract getPayment(sessionId: string);
}

@Injectable()
export class SubscriptionsRepository implements ISubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findBusinessAccountByUserId(userId: number): Promise<BusinessAccountEntity> {
    const businessAccount = await this.prisma.businessAccount.findFirst({
      where: { userId },
      include: {
        subscriptions: true,
      },
    });
    return plainToInstance(BusinessAccountEntity, businessAccount);
  }
  async saveSubscription(
    subscription: SubscriptionEntity,
    payment: PaymentEntity,
    businessAccount: BusinessAccountEntity,
  ) {
    //create subscription and payment in one transaction
    return this.prisma.$transaction(async tx => {
      //find or create business account
      await tx.businessAccount.upsert({
        create: {
          userId: subscription.businessAccountId,
          subscriptions: {
            create: [],
          },
        },
        where: { userId: subscription.businessAccountId },
        update: {
          stripeCustomerId: businessAccount.stripeCustomerId,
        },
      });

      const createdSubscription = await tx.subscription.create({
        data: {
          businessAccountId: subscription.businessAccountId,
          status: subscription.status,
          type: subscription.type,
          price: subscription.price,
          paymentType: subscription.paymentType,
          autoRenew: subscription.autoRenew,
          payments: {
            create: [],
          },
          renewals: {
            create: [],
          },
        },
      });
      const createdPayment = await tx.payment.create({
        data: {
          sessionId: payment.sessionId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          subscriptionId: createdSubscription.id,
        },
      });
      //update subscription with payment id
      await tx.subscription.update({
        where: { id: createdSubscription.id },
        data: {
          payments: {
            connect: {
              id: createdPayment.id,
            },
          },
        },
      });
      //update business account with subscription id
      await tx.businessAccount.update({
        where: { userId: subscription.businessAccountId },
        data: {
          stripeCustomerId: businessAccount.stripeCustomerId,
          subscriptions: {
            connect: {
              id: createdSubscription.id,
            },
          },
        },
      });
      //update user with business account id
      await tx.user.update({
        where: { id: subscription.businessAccountId },
        data: {
          hasBusinessAccount: true,
        },
      });
    });
  }

  async getPayment(sessionId: string) {
    return this.prisma.payment.findFirst({
      where: { sessionId },
      include: {
        subscription: true,
      },
    });
  }
}
