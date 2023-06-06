import { IsEnum, IsInstance, IsNumber, IsString } from 'class-validator';
import { CreateSessionRequestInterface } from '@common/modules/ampq/ampq-contracts/queues/images/subscriptions.contract';
import { SubscriptionType } from '@common/main/types/subscription.type';
import { PaymentMethod } from '@common/main/types/payment.method';

export class CreateSubscriptionInputDto {
  @IsEnum(SubscriptionType)
  typeSubscription: SubscriptionType;

  @IsEnum(PaymentMethod)
  paymentType: PaymentMethod;

  @IsNumber()
  amount: number;
}

export class CreateSessionInputDto implements CreateSessionRequestInterface {
  @IsString()
  customerId: string;
  @IsString()
  email: string;
  @IsString()
  userName: string;
  @IsInstance(CreateSubscriptionInputDto)
  subscriptionInputData: CreateSubscriptionInputDto;
}
