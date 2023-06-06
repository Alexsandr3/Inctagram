import { IsEnum, IsInstance, IsNumber, IsString } from 'class-validator';
import { SubscriptionType } from '@common/main/types/subscription.type';
import { PaymentMethod } from '@common/main/types/payment.method';
import {
  CreateSessionRequestInterface,
  CreateSubscriptionInterface,
} from '@common/main/types/create-session-interface.type';

export class CreateSubscriptionInputDto implements CreateSubscriptionInterface {
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
