import { PrismaService } from '../../../providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CurrentSubscriptionViewModel } from '../api/view-model/current-subscription-view.dto';
import { PaymentsViewModel } from '../api/view-model/payments-view.dto';
import { plainToInstance } from 'class-transformer';
import { Paginated } from '../../../main/shared/paginated';
import { StatusSubscriptionType } from '@prisma/client';
import { PaginationSubscriptionInputDto } from '../api/input-dtos/pagination-subscription.input.dto';
import { PaymentsWithPaginationViewDto } from '../api/view-model/payments-with-pagination-view.dto';

export abstract class ISubscriptionsQueryRepository {
  abstract getCurrentSubscription(userId: number): Promise<CurrentSubscriptionViewModel>;

  abstract getMyPayments(
    userId: number,
    paginationInputModel: PaginationSubscriptionInputDto,
  ): Promise<Paginated<PaymentsViewModel[]>>;
}
@Injectable()
export class SubscriptionsQueryRepository implements ISubscriptionsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentSubscription(userId: number): Promise<CurrentSubscriptionViewModel> {
    console.log('userId', userId);
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        businessAccountId: userId,
        status: 'ACTIVE',
      },
    });
    return new CurrentSubscriptionViewModel(
      subscription.businessAccountId,
      subscription.customerId,
      subscription.dateOfPayment,
      subscription.endDate,
    );
  }

  async getMyPayments(
    userId: number,
    paginationInputModel: PaginationSubscriptionInputDto,
  ): Promise<Paginated<PaymentsViewModel[]>> {
    //find all subscriptions for current user
    const subscription = await this.prisma.subscription.findMany({
      where: {
        businessAccountId: userId,
        status: StatusSubscriptionType.ACTIVE,
      },
      orderBy: {
        dateOfPayment: paginationInputModel.isSortDirection(),
      },
      skip: paginationInputModel.skip, //(page - 1) * limit,
      take: paginationInputModel.getPageSize(), //limit
      include: {
        payments: true,
      },
    });
    const ins = [];
    for (const sub of subscription) {
      ins.push(plainToInstance(PaymentsViewModel, sub));
    }
    return PaymentsWithPaginationViewDto.getPaginated({
      items: ins.map(
        subscription =>
          new PaymentsViewModel(
            userId,
            subscription.customerId,
            subscription.dateOfPayment,
            subscription.endDate,
            subscription.price,
            subscription.type,
            subscription.paymentType,
          ),
      ),
      page: paginationInputModel.getPageNumber(),
      size: paginationInputModel.getPageSize(),
      count: ins.length,
    });
  }
}
