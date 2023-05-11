import { Injectable, Logger } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';
import { CreateSubscriptionInputDto } from '../../../modules/subscriptions/api/input-dtos/create-subscription-input.dto';
import { SubscriptionType } from '../../../modules/subscriptions/types/subscription.type';

@Injectable()
export class PaymentStripeService {
  private logger = new Logger(PaymentStripeService.name);
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2022-11-15' });
  serverUrl: string;
  // priceIdOnePaymentForOneMonth: string;
  priceIdSubscriptionMonthly: string;
  costCurrentMonthSubscription: number;

  constructor(private readonly configService: ApiConfigService) {
    this.serverUrl = this.configService.TEST_CLIENT_URL;
    // this.priceIdOnePaymentForOneMonth = this.configService.PRICE_ID_MONTHLY;
    this.priceIdSubscriptionMonthly = this.configService.MONTHLY_SUBSCRIPTION_PRICE_ID;
    this.costCurrentMonthSubscription = this.configService.COST_SUBSCRIPTION;
  }

  /**
   * Create a session for Stripe Checkout
   * @param createSubscriptionDto
   * @param email
   * @param userName
   * @param id
   */
  async createSession(createSubscriptionDto: CreateSubscriptionInputDto, email: string, userName: string, id: number) {
    let line_items;
    //
    const priceId = this.priceIdSubscriptionMonthly;
    const quantity = this.getQuantity(createSubscriptionDto);
    if (!createSubscriptionDto.autoRenew) {
      line_items = this.createLineItemsOnePaymentForOneMonth(createSubscriptionDto.amount);
    } else {
      line_items = this.createLineItemsSubscriptionMonthly(quantity, priceId);
    }
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: createSubscriptionDto.autoRenew ? 'subscription' : 'payment',
        payment_method_types: ['card'],
        client_reference_id: id.toString(),
        customer_email: email,
        line_items: line_items,
        // success_url: `${this.serverUrl}` + '/success.html?session_id={CHECKOUT_SESSION_ID}',
        success_url: `${this.serverUrl}` + '/profile/settings/edit?payment-success=true',
        cancel_url: `${this.serverUrl}/profile/settings/edit?payment-success=false`,
      });
      return session;
    } catch (e) {
      this.logger.error(e, 'error');
      console.log(e, 'error');
    }
  }
  private createLineItemsOnePaymentForOneMonth(amount: number) {
    return [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Inctagram Premium Subscription',
            images: ['https://nest-public-avatar.s3.eu-central-1.amazonaws.com/Screenshot+2023-05-05+at+09.47.43.png'],
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ];
  }
  private createLineItemsSubscriptionMonthly(quantity: number, priceId: string) {
    return [
      {
        price: priceId,
        quantity: quantity,
      },
    ];
  }

  //-------------------------------------------->

  /**
   * Get cost of subscription
   * @param createSubscriptionDto
   * @private
   */
  // private getPriceId(createSubscriptionDto: CreateSubscriptionInputDto) {
  //   //
  //   return createSubscriptionDto.autoRenew ? this.priceIdSubscriptionMonthly : this.priceIdOnePaymentForOneMonth;
  // }
  /**
   * Get quantity of subscription
   * @param createSubscriptionDto
   * @private
   */
  private getQuantity(createSubscriptionDto: CreateSubscriptionInputDto): number {
    const period = createSubscriptionDto.typeSubscription;
    if (period === SubscriptionType.MONTHLY) {
      return 1;
    }
    if (period === SubscriptionType.SEMI_ANNUALLY) {
      return 6;
    }
    if (period === SubscriptionType.YEARLY) {
      return 10;
    }
  }
}
