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
  priceIdOnePaymentForOneMonth: string;
  priceIdSubscriptionMonthly: string;
  costCurrentMonthSubscription: number;

  constructor(private readonly configService: ApiConfigService) {
    this.serverUrl = this.configService.CURRENT_APP_BASE_URL;
    this.priceIdOnePaymentForOneMonth = this.configService.PRICE_ID_MONTHLY;
    this.priceIdSubscriptionMonthly = this.configService.PRICE_ID_SUBSCRIPTION_MONTHLY;
    this.costCurrentMonthSubscription = this.configService.COST_SUBSCRIPTION;
  }

  public async createCustomer(name: string, email: string): Promise<string> {
    const customer = await this.stripe.customers.create({ name, email });
    return customer.id;
  }

  /**
   * Create a session for Stripe Checkout
   * @param createSubscriptionDto
   */
  async createSession(createSubscriptionDto: CreateSubscriptionInputDto, email: string, userName: string, id: number) {
    const priceId = this.getPriceId(createSubscriptionDto);
    const quantity = this.getQuantity(createSubscriptionDto);
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: createSubscriptionDto.autoRenew ? 'subscription' : 'payment',
        payment_method_types: ['card'],
        client_reference_id: id.toString(),
        customer_email: email,
        line_items: [
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        success_url: `${this.serverUrl}` + '/payments/stripe/success.html?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: `${this.serverUrl}/canceled.html`,
      });
      return session;
    } catch (e) {
      this.logger.error(e);
      console.log(e, 'error');
    }
  }

  /**
   * Get cost of subscription
   * @param createSubscriptionDto
   * @private
   */
  private getPriceId(createSubscriptionDto: CreateSubscriptionInputDto) {
    return createSubscriptionDto.autoRenew ? this.priceIdSubscriptionMonthly : this.priceIdOnePaymentForOneMonth;
  }

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
