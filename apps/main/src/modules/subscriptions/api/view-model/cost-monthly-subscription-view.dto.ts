import { SubscriptionType } from '../../types/subscription.type';

export class SubscriptionPriceViewModel {
  data: PricingDetailsViewModel[];

  constructor(cost: number) {
    this.data = [
      PricingDetailsViewModel.create(+cost, SubscriptionType.MONTHLY),
      PricingDetailsViewModel.create(cost * 5, SubscriptionType.SEMI_ANNUALLY),
      PricingDetailsViewModel.create(cost * 10, SubscriptionType.YEARLY),
    ];
  }
}

export class PricingDetailsViewModel {
  amount: number;
  typeDescription: SubscriptionType;

  constructor(amount: number, typeDescription: SubscriptionType) {
    this.amount = amount;
    this.typeDescription = typeDescription;
  }

  static create(amount: number, typeDescription: SubscriptionType) {
    return new PricingDetailsViewModel(amount, typeDescription);
  }
}
