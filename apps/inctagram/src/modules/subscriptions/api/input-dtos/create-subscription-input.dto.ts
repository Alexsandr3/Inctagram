import { IsEnum, IsNumber } from 'class-validator';
import { SubscriptionType } from '../../types/subscription.type';
import { PaymentMethod } from '../../types/payment.method';

/**
 * @description Create subscription input type
 */
export class CreateSubscriptionInputDto {
  @IsEnum(SubscriptionType)
  typeSubscription: SubscriptionType;

  @IsEnum(PaymentMethod)
  paymentType: PaymentMethod;

  @IsNumber()
  amount: number;
}
