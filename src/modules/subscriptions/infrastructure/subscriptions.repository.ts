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

  abstract getPayment(sessionId: string): Promise<PaymentEntity>;

  abstract getSubscriptionByPaymentSessionId(id: string): Promise<SubscriptionEntity>;

  abstract saveSubscriptionWithPayment(subscriptionEntity: SubscriptionEntity);
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
      const createdSubscription = await tx.subscription.create({
        data: {
          businessAccountId: businessAccount.userId,
          customerId: subscription.customerId,
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
          paymentSessionId: payment.paymentSessionId,
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
        where: { userId: businessAccount.userId },
        data: {
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

  async getPayment(sessionId: string): Promise<PaymentEntity> {
    //find payment with subscription
    const payment = await this.prisma.payment.findFirst({
      where: { paymentSessionId: sessionId },
      include: {
        subscription: true,
      },
    });
    return plainToInstance(PaymentEntity, payment);
  }

  async getSubscriptionByPaymentSessionId(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { payments: { some: { paymentSessionId: id } } },
      include: {
        payments: true,
      },
    });
    return plainToInstance(SubscriptionEntity, subscription);
  }

  async saveSubscriptionWithPayment(subscriptionEntity: SubscriptionEntity) {
    //create subscription and payment in one transaction
    return this.prisma.$transaction(async tx => {
      await tx.subscription.update({
        where: { id: subscriptionEntity.id },
        data: {
          status: subscriptionEntity.status,
          type: subscriptionEntity.type,
          customerId: subscriptionEntity.customerId,
          dateOfPayment: subscriptionEntity.dateOfPayment,
          endDate: subscriptionEntity.endDate,
          price: subscriptionEntity.price,
          paymentType: subscriptionEntity.paymentType,
          autoRenew: subscriptionEntity.autoRenew,
        },
      });
      //update payment
      await tx.payment.update({
        where: { id: subscriptionEntity.payments[0].id },
        data: {
          status: subscriptionEntity.payments[0].status,
          context: subscriptionEntity.payments[0].context,
        },
      });
    });
  }
}
