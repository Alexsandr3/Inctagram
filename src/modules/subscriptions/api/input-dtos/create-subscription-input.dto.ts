import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { SubscriptionType } from '../../types/subscription.type';
import { PaymentMethod } from '../../types/payment.method';

export class CreateSubscriptionInputDto {
  @IsEnum(SubscriptionType)
  typeSubscription: SubscriptionType; //monthly, yearly

  @IsEnum(PaymentMethod)
  paymentType: PaymentMethod; //stripe, paypal

  @IsNumber()
  amount: number;

  @IsBoolean()
  autoRenew: boolean;
}
