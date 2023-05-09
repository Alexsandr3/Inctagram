import { Module } from '@nestjs/common';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription-use.case';
import { CqrsModule } from '@nestjs/cqrs';
import { SubscriptionsController } from './api/subscriptions.controllers';
import { UsersModule } from '../users/users.module';
import { PaymentsModule } from '../../providers/payment/payments.module';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ISubscriptionsRepository, SubscriptionsRepository } from './infrastructure/subscriptions.repository';
import { SuccessSubscriptionHandler } from './application/event-handlers/success-subscription.handler';
import { FailedSubscriptionHandler } from './application/event-handlers/failed-subscription.handler';

const useCases = [CreateSubscriptionUseCase];
const handlers = [SuccessSubscriptionHandler, FailedSubscriptionHandler];

@Module({
  imports: [CqrsModule, UsersModule, PaymentsModule, ApiConfigModule],
  controllers: [SubscriptionsController],
  providers: [
    ...useCases,
    ...handlers,
    {
      provide: ISubscriptionsRepository,
      useClass: SubscriptionsRepository,
    },
  ],
})
export class SubscriptionsModule {}
