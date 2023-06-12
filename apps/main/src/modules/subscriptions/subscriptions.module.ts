import { Module } from '@nestjs/common';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription-use.case';
import { CqrsModule } from '@nestjs/cqrs';
import { SubscriptionsController } from './api/subscriptions.controllers';
import { UsersModule } from '../users/users.module';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ISubscriptionsRepository, SubscriptionsRepository } from './infrastructure/subscriptions.repository';
import {
  ISubscriptionsQueryRepository,
  SubscriptionsQueryRepository,
} from './infrastructure/subscriptions-query.repository';
import { GetSubscriptionsController } from './api/get-subscriptions.controllers';
import { CanceledAutoRenewalUseCase } from './application/use-cases/canceled-auto-renewal-use.case';
import { ClientModule } from '../Clients/client.module';
import { SubscriptionsEventHandler } from './application/subscriptions-event-handler';
import { ActivateSubscriptionUseCase } from './application/use-cases/activate-subscription-use.case';
import { UnActivateSubscriptionUseCase } from './application/use-cases/unactivate-subscription-use.case';

const useCases = [
  CreateSubscriptionUseCase,
  CanceledAutoRenewalUseCase,
  ActivateSubscriptionUseCase,
  UnActivateSubscriptionUseCase,
];

@Module({
  imports: [CqrsModule, UsersModule, ApiConfigModule, ClientModule],
  controllers: [SubscriptionsController, GetSubscriptionsController],
  providers: [
    ...useCases,
    // SubscriptionEventHandler,
    SubscriptionsEventHandler,
    {
      provide: ISubscriptionsRepository,
      useClass: SubscriptionsRepository,
    },
    {
      provide: ISubscriptionsQueryRepository,
      useClass: SubscriptionsQueryRepository,
    },
  ],
  exports: [ISubscriptionsRepository],
})
export class SubscriptionsModule {}
