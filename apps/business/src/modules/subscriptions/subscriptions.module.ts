import { Module } from '@nestjs/common';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription-use.case';
import { CqrsModule } from '@nestjs/cqrs';
import { SubscriptionsController } from './api/subscriptions.controllers';
import { UsersModule } from '../../../../inctagram/src/modules/users/users.module';
import { PaymentsModule } from '../payment/payments.module';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ISubscriptionsRepository, SubscriptionsRepository } from './infrastructure/subscriptions.repository';
import {
  ISubscriptionsQueryRepository,
  SubscriptionsQueryRepository,
} from './infrastructure/subscriptions-query.repository';
import { GetSubscriptionsController } from './api/get-subscriptions.controllers';
import { CanceledAutoRenewalUseCase } from './application/use-cases/canceled-auto-renewal-use.case';
import { SubscriptionEventHandler } from './application/subscription-event-handler';

const useCases = [CreateSubscriptionUseCase, CanceledAutoRenewalUseCase];

@Module({
  imports: [CqrsModule, UsersModule, PaymentsModule, ApiConfigModule, PaymentsModule],
  controllers: [SubscriptionsController, GetSubscriptionsController],
  providers: [
    ...useCases,
    SubscriptionEventHandler,
    {
      provide: ISubscriptionsRepository,
      useClass: SubscriptionsRepository,
    },
    {
      provide: ISubscriptionsQueryRepository,
      useClass: SubscriptionsQueryRepository,
    },
  ],
})
export class SubscriptionsModule {}
