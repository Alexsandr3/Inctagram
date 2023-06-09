import { BusinessAccountEntity } from '../domain/business-account.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { SubscriptionEntity } from '../domain/subscription.entity';
import { StatusSubscriptionType } from '@common/main/types/status-subscription.type';
import { PaymentStatus } from '@common/main/types/paymentStatus';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';
import { SubscriptionForSuperAdminViewModel } from '../../super-admin/api/models/subscription-for-super-admin-view.model';
import { IPaginationInputDto } from '../../super-admin/api/input-dto/pagination.input.interface';
import { Paginated } from '../../../main/shared/paginated';
import { PaymentsWithPaginationViewModel } from '../../super-admin/api/models/payments-with-pagination-view.model';

/**
 * Abstract class that represents the repository of the Clients.
 * ['findBusinessAccountByUserId', 'getSubscriptionWithStatusPendingByPaymentSessionId',
 * 'saveSubscriptionWithPayment', 'updateBusinessAccountWithSubscriptionAndPayment',
 * 'getLastActiveCreatedSubscriptionByCustomerId']
 */
export abstract class ISubscriptionsRepository {
  abstract findBusinessAccountByUserId(userId: number): Promise<BusinessAccountEntity>;

  abstract getSubscriptionWithStatusPendingByPaymentSessionId(id: string): Promise<SubscriptionEntity>;

  abstract saveSubscriptionWithPayment(
    subscriptionEntity: SubscriptionEntity,
    event?: OutboxEventEntity,
  ): Promise<void>;

  abstract updateBusinessAccountWithSubscriptionAndPayment(businessAccount: BusinessAccountEntity): Promise<void>;

  abstract getLastActiveCreatedSubscriptionByCustomerId(customerId: string): Promise<SubscriptionEntity>;

  // Super Admin
  abstract getSubscriptionForSuperAdmin(userIds: number[]): Promise<SubscriptionForSuperAdminViewModel[]>;
  abstract getPaymentsById(
    userId: number,
    pagination: IPaginationInputDto,
  ): Promise<Paginated<SubscriptionForSuperAdminViewModel[]>>;
}

@Injectable()
export class SubscriptionsRepository implements ISubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findBusinessAccountByUserId(userId: number): Promise<BusinessAccountEntity> {
    const businessAccount = await this.prisma.businessAccount.findFirst({
      where: { userId },
      include: {
        subscriptions: {
          where: { status: StatusSubscriptionType.ACTIVE },
          include: {
            payments: true,
          },
        },
      },
    });
    return plainToInstance(BusinessAccountEntity, businessAccount);
  }

  async getSubscriptionWithStatusPendingByPaymentSessionId(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { payments: { some: { paymentSessionId: id } } },
      include: {
        payments: true,
      },
    });
    return plainToInstance(SubscriptionEntity, subscription);
  }

  async saveSubscriptionWithPayment(subscriptionEntity: SubscriptionEntity, event?: OutboxEventEntity): Promise<void> {
    //create subscription and payment in one transaction
    return this.prisma.$transaction(async tx => {
      await tx.subscription.update({
        where: { id: subscriptionEntity.id },
        data: {
          status: subscriptionEntity.status,
          externalSubId: subscriptionEntity.externalSubId,
          type: subscriptionEntity.type,
          customerId: subscriptionEntity.customerId,
          dateOfPayment: subscriptionEntity.dateOfPayment,
          startDate: subscriptionEntity.startDate,
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
        },
      });
      //create event
      if (event) {
        await tx.outBoxEvent.create({
          data: {
            userId: event.userId,
            senderService: event.senderService,
            eventName: event.eventName,
            payload: event.payload,
          },
        });
      }
    });
  }

  async updateBusinessAccountWithSubscriptionAndPayment(businessAccount: BusinessAccountEntity): Promise<void> {
    //Clients with status active
    const subscriptions = businessAccount.subscriptions.filter(subscription => {
      if (subscription.status === StatusSubscriptionType.ACTIVE) {
        return {
          where: { id: subscription.id },
          data: {
            externalSubId: subscription.externalSubId,
            businessAccountId: subscription.businessAccountId,
            customerId: subscription.customerId,
            status: subscription.status,
            dateOfPayment: subscription.dateOfPayment,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            type: subscription.type,
            price: subscription.price,
            paymentType: subscription.paymentType,
            autoRenew: subscription.autoRenew,
          },
        };
      }
    });
    //subscription with payment need create
    const newSubscription = businessAccount.subscriptions.filter(subscription => {
      if (subscription.status === StatusSubscriptionType.PENDING) {
        return {
          externalSubId: subscription.externalSubId,
          businessAccountId: subscription.businessAccountId,
          customerId: subscription.customerId,
          status: subscription.status,
          dateOfPayment: subscription.dateOfPayment,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          type: subscription.type,
          price: subscription.price,
          paymentType: subscription.paymentType,
          autoRenew: subscription.autoRenew,
          payments: {
            create: [],
          },
        };
      }
    });
    let newPayment = [];
    if (newSubscription.length > 0) {
      // find payment with id null
      newPayment = newSubscription[0].payments.filter(payment => {
        if (payment.status === PaymentStatus.PENDING) {
          return {
            paymentSessionId: payment.paymentSessionId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            context: payment.context,
          };
        }
      });
    }

    //update payments-ms account in one transaction
    return this.prisma.$transaction(async tx => {
      //set default data payments-ms account
      // const defaultData = {
      //   where: { userId: businessAccount.userId },
      //   data: {
      //     stipeCustomerId: businessAccount.stipeCustomerId,
      //   },
      // };
      //update Clients
      if (subscriptions.length > 0) {
        for (const subscription of subscriptions) {
          await tx.subscription.update({
            where: { id: subscription.id },
            data: {
              id: subscription.id,
              externalSubId: subscription.externalSubId,
              businessAccountId: subscription.businessAccountId,
              customerId: subscription.customerId,
              status: subscription.status,
              dateOfPayment: subscription.dateOfPayment,
              endDate: subscription.endDate,
              type: subscription.type,
              price: subscription.price,
              paymentType: subscription.paymentType,
              autoRenew: subscription.autoRenew,
            },
          });
        }
      }
      //update payments-ms account
      await tx.businessAccount.update({
        where: { userId: businessAccount.userId },
        data: {
          stipeCustomerId: businessAccount.stipeCustomerId,
        },
      });
      //if Clients exists update it else create it
      if (newSubscription.length > 0) {
        const createdSubscriptions = await tx.subscription.create({
          data: {
            externalSubId: newSubscription[0].externalSubId,
            businessAccountId: newSubscription[0].businessAccountId,
            customerId: newSubscription[0].customerId,
            status: newSubscription[0].status,
            dateOfPayment: newSubscription[0].dateOfPayment,
            startDate: newSubscription[0].startDate,
            endDate: newSubscription[0].endDate,
            type: newSubscription[0].type,
            price: newSubscription[0].price,
            paymentType: newSubscription[0].paymentType,
            autoRenew: newSubscription[0].autoRenew,
            payments: {
              create: [],
            },
          },
        });
        //create payment
        await tx.payment.create({
          data: {
            paymentSessionId: newPayment[0].paymentSessionId,
            amount: newPayment[0].amount,
            currency: newPayment[0].currency,
            status: newPayment[0].status,
            subscriptionId: createdSubscriptions.id,
          },
        });
      }
    });
  }

  async getLastActiveCreatedSubscriptionByCustomerId(customerId: string): Promise<SubscriptionEntity> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { customerId: customerId, status: StatusSubscriptionType.ACTIVE },
      orderBy: { createdAt: 'desc' },
      include: {
        payments: true,
      },
    });
    return plainToInstance(SubscriptionEntity, subscription);
  }

  async getSubscriptionForSuperAdmin(userIds: number[]): Promise<SubscriptionForSuperAdminViewModel[]> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        businessAccountId: {
          in: userIds,
        },
      },
    });
    return subscriptions.map(s =>
      SubscriptionForSuperAdminViewModel.create(
        s.businessAccountId,
        s.dateOfPayment,
        s.endDate,
        s.price,
        s.type,
        s.paymentType,
      ),
    );
  }
  async getPaymentsById(
    userId: number,
    pagination: IPaginationInputDto,
  ): Promise<Paginated<SubscriptionForSuperAdminViewModel[]>> {
    const { skip, getPageSize, getPageNumber, sortBy, isSortDirection } = pagination;

    const [subscriptions, count] = await this.prisma.$transaction([
      this.prisma.subscription.findMany({
        where: {
          businessAccountId: userId,
        },
        orderBy: { [sortBy]: isSortDirection },
        skip: skip,
        take: getPageSize,
      }),
      this.prisma.subscription.count({
        where: {
          businessAccountId: userId,
        },
      }),
    ]);
    const viewPayments = subscriptions.map(s =>
      SubscriptionForSuperAdminViewModel.create(
        s.businessAccountId,
        s.dateOfPayment,
        s.endDate,
        s.price,
        s.type,
        s.paymentType,
      ),
    );
    return PaymentsWithPaginationViewModel.getPaginated({
      items: viewPayments,
      page: getPageNumber,
      size: getPageSize,
      count: count,
    });
  }
}
