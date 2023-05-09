import { Injectable, Logger } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';
import { CreateSubscriptionInputDto } from '../../../modules/subscriptions/api/input-dtos/create-subscription-input.dto';

@Injectable()
export class PaymentService {
  private logger = new Logger(PaymentService.name);
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2022-11-15' });
  serverUrl: string;
  priceIdOnePaymentForOneMonth: string;
  priceIdSubscriptionMonthly: string;

  constructor(private readonly configService: ApiConfigService) {
    this.serverUrl = this.configService.CURRENT_APP_BASE_URL;
    this.priceIdOnePaymentForOneMonth = this.configService.PRICE_ID_MONTHLY;
    this.priceIdSubscriptionMonthly = this.configService.PRICE_ID_SUBSCRIPTION_MONTHLY;
  }

  public async createCustomer(name: string, email: string): Promise<string> {
    const customer = await this.stripe.customers.create({ name, email });
    return customer.id;
  }

  async createSession(stripeCustomerId: string, createSubscriptionDto: CreateSubscriptionInputDto) {
    const priceId = this.getPriceId(createSubscriptionDto);
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: createSubscriptionDto.autoRenew ? 'subscription' : 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            // For metered billing, do not pass quantity
            quantity: 1,
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

  private getPriceId(createSubscriptionDto: CreateSubscriptionInputDto) {
    return createSubscriptionDto.autoRenew ? this.priceIdSubscriptionMonthly : this.priceIdOnePaymentForOneMonth;
  }
}
