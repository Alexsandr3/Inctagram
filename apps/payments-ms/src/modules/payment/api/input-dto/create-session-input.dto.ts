import { IsEnum, IsInstance, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
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
  @IsPositive()
  amount: number;
}

export class CreateSessionInputDto implements CreateSessionRequestInterface {
  // @Transform(({ value }) => (typeof value === 'string' ? (value.trim() ? value.trim() : null) : value))
  @IsString()
  @IsOptional()
  customerId: string | null;
  @IsString()
  email: string;
  @IsString()
  userName: string;
  @IsInstance(CreateSubscriptionInputDto)
  subscriptionInputData: CreateSubscriptionInputDto;
}
