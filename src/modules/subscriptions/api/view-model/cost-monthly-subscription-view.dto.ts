import { SubscriptionType } from '../../types/subscription.type';

/**
 * @description - SubscriptionPriceViewModel - contains data cost of subscriptions
 */
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

/**
 * @description - PricingDetailsViewModel - The price of the subscription for a certain period with a description
 */
export class PricingDetailsViewModel {
  amount: number;
  typeDescription: SubscriptionType;
  description: string;

  constructor(amount: number, typeDescription: SubscriptionType) {
    this.amount = amount;
    this.typeDescription = typeDescription;
    this.description = this.getDescription(typeDescription, amount);
  }

  static create(amount: number, typeDescription: SubscriptionType) {
    return new PricingDetailsViewModel(amount, typeDescription);
  }

  private getDescription(typeDescription: SubscriptionType, amount: number): string {
    return `${amount}$ ${descriptionPrice[typeDescription]}`;
  }
}

/**
 * @description - descriptionPrice - object with description of subscription for each type
 */
const descriptionPrice = {
  [SubscriptionType.MONTHLY]: `per month`,
  [SubscriptionType.SEMI_ANNUALLY]: `per 6 months`,
  [SubscriptionType.YEARLY]: `per year`,
};
