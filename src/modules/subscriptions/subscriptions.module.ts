import { Module } from '@nestjs/common';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription-use.case';
import { CqrsModule } from '@nestjs/cqrs';
import { SubscriptionsController } from './api/subscriptions.controllers';
import { UsersModule } from '../users/users.module';
import { PaymentsModule } from '../../providers/payment/payments.module';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ISubscriptionsRepository, SubscriptionsRepository } from './infrastructure/subscriptions.repository';
import {
  ISubscriptionsQueryRepository,
  SubscriptionsQueryRepository,
} from './infrastructure/subscriptions-query.repository';
import { GetSubscriptionsController } from './api/get-subscriptions.controllers';
import { CanceledAutoRenewalUseCase } from './application/use-cases/canceled-auto-renewal-use.case';
import { SubscriptionEventHandlerService } from './application/subscription-event-handler.service';

const useCases = [CreateSubscriptionUseCase, CanceledAutoRenewalUseCase];

@Module({
  imports: [CqrsModule, UsersModule, PaymentsModule, ApiConfigModule],
  controllers: [SubscriptionsController, GetSubscriptionsController],
  providers: [
    ...useCases,
    SubscriptionEventHandlerService,
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
