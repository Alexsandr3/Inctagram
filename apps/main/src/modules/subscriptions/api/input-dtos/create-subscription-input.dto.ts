import { IsEnum, IsNumber } from 'class-validator';
import { SubscriptionType } from '@common/main/types/subscription.type';
import { PaymentMethod } from '@common/main/types/payment.method';
import { CreateSubscriptionInterface } from '@common/main/types/create-session-interface.type';

/**
 * @description Create subscription input type
 */
export class CreateSubscriptionInputDto implements CreateSubscriptionInterface {
  @IsEnum(SubscriptionType)
  typeSubscription: SubscriptionType;

  @IsEnum(PaymentMethod)
  paymentType: PaymentMethod;

  @IsNumber()
  amount: number;
}
