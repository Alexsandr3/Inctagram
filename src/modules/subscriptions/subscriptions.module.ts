import { Module } from '@nestjs/common';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription-use.case';
import { CqrsModule } from '@nestjs/cqrs';
import { SubscriptionsController } from './api/subscriptions.controllers';
import { UsersModule } from '../users/users.module';
import { PaymentsModule } from '../../providers/payment/payments.module';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ISubscriptionsRepository, SubscriptionsRepository } from './infrastructure/subscriptions.repository';
import { SuccessSubscriptionUseCase } from './application/use-cases/success-subscription-use.case';

const useCases = [CreateSubscriptionUseCase, SuccessSubscriptionUseCase];

@Module({
  imports: [CqrsModule, UsersModule, PaymentsModule, ApiConfigModule],
  controllers: [SubscriptionsController],
  providers: [
    ...useCases,
    {
      provide: ISubscriptionsRepository,
      useClass: SubscriptionsRepository,
    },
  ],
})
export class SubscriptionsModule {}
