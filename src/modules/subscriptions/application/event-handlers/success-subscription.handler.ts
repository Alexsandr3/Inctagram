import { Injectable } from '@nestjs/common';
import { PaymentEventType } from '../../../../providers/payment/payment-event.type';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';

@Injectable()
export class SuccessSubscriptionHandler {
  private emitter: EventEmitter2;
  constructor(private eventEmitter: EventEmitter2, private readonly subscriptionsRepository: ISubscriptionsRepository) {
    this.emitter = eventEmitter;
  }

  @OnEvent(PaymentEventType.successSubscription)
  async handle(event: StripeEventType) {
    console.log('SuccessSubscriptionHandler', event);
    // find subscription where payments contains paymentSessionId
    const subscriptionEntity = await this.subscriptionsRepository.getSubscriptionByPaymentSessionId(
      event.data.object.id,
    );
    // update subscription status to active
    subscriptionEntity.changeStatusToActive(event);
    //save subscription
    await this.subscriptionsRepository.saveSubscriptionWithPayment(subscriptionEntity);
  }
}

export type StripeEventType = {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: {
      id: string;
      object: string;
      after_expiration: null;
      allow_promotion_codes: null;
      amount_subtotal: number;
      amount_total: number;
      automatic_tax: object;
      billing_address_collection: null;
      cancel_url: string;
      client_reference_id: null;
      consent: null;
      consent_collection: null;
      created: Date;
      currency: string;
      currency_conversion: null;
      custom_fields: any[];
      custom_text: object;
      customer: string;
      customer_creation: null;
      customer_details: object;
      customer_email: null;
      expires_at: number;
      invoice: null;
      invoice_creation: object;
      livemode: boolean;
      locale: null;
      metadata: object;
      mode: string;
      payment_intent: string;
      payment_link: null;
      payment_method_collection: string;
      payment_method_options: object;
      payment_method_types: string[];
      payment_status: string;
      phone_number_collection: object;
      recovered_from: null;
      setup_intent: null;
      shipping_address_collection: null;
      shipping_cost: null;
      shipping_details: null;
      shipping_options: any[];
      status: string;
      submit_type: null;
      subscription: null;
      success_url: string;
      total_details: object;
      url: null;
    };
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: null;
    idempotency_key: null;
  };
  type: string;
};
