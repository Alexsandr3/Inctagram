import { Field, GraphQLISODateTime, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SubscriptionEntity } from '../../../subscriptions/domain/subscription.entity';
import { PaymentMethod } from '@common/main/types/payment.method';
import { SubscriptionType } from '@common/main/types/subscription.type';

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'Payment Method [STRIPE, PAYPAL]',
});
registerEnumType(SubscriptionType, {
  name: 'SubscriptionType',
  description: 'Subscription Type [MONTHLY, SEMI_ANNUALLY, YEARLY]',
});

@ObjectType()
export class SubscriptionForSuperAdminViewModel extends SubscriptionEntity {
  @Field(() => Number, { nullable: true })
  ownerId: number;
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate: Date;
  @Field(() => Number, { nullable: true })
  price: number;
  @Field(() => SubscriptionType, { nullable: true })
  type: SubscriptionType;
  @Field(() => PaymentMethod, { nullable: true })
  paymentType: PaymentMethod;
  constructor() {
    super();
  }

  static create(
    ownerId: number,
    dataOfPayment: Date,
    price: number,
    type: string,
    paymentType: string,
  ): SubscriptionForSuperAdminViewModel {
    const subscription = new SubscriptionForSuperAdminViewModel();
    subscription.ownerId = ownerId;
    subscription.startDate = dataOfPayment;
    subscription.price = price;
    subscription.type = type as SubscriptionType;
    subscription.paymentType = paymentType as PaymentMethod;
    return subscription;
  }
}
