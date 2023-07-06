import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import axios, { AxiosResponse } from 'axios';
import { SubscriptionType } from '@common/main/types/subscription.type';

@Injectable()
export class PaymentPaypalService {
  baseURL = {
    sandbox: 'https://api-m.sandbox.paypal.com',
    production: 'https://api-m.paypal.com',
  };
  auth: string;

  constructor(private readonly configService: ApiConfigService) {
    this.auth = Buffer.from(configService.PAYPAL_CLIENT_ID + ':' + configService.PAYPAL_APP_SECRET).toString('base64');
  }

  async createSession(params: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<{ customer: string; id: string; url: string }> {
    const result = await this._createOrder();
    return { customer: params.customerId, id: result.id, url: result.links[1].href };
  }

  private async _createOrder() {
    const accessToken = await this._generateAccessToken();
    const url = `${this.baseURL.sandbox}/v2/checkout/orders`;
    const response = await axios.post(
      url,
      {
        intent: 'CAPTURE',
        subject: 'SUBSCRIPTION',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '10.00',
            },
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } },
    );
    return this._handleResponse(response);
  }

  private async _generateAccessToken(): Promise<string> {
    const response = await axios.post(`${this.baseURL.sandbox}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: { Authorization: `Basic ${this.auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const body = await this._handleResponse(response);
    return body.access_token;
  }

  private async _handleResponse(response: AxiosResponse) {
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    const errorMessage = await response.data.error.message;
    throw new Error(errorMessage);
  }
}

//  async _createSession() {
//     const { CLIENT_ID_PAYPAL, APP_SECRET_PAYPAL } = process.env;
//     const auth = Buffer.from(CLIENT_ID_PAYPAL + ':' + APP_SECRET_PAYPAL).toString('base64');
//     const accessToken = await this._generateAccessToken(auth);
//     const response = await axios.post(
//       'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
//       {
//         plan_id: 'P-3RX06588JW0467940M5Y2Z7I',
//         custom_id: '123456789',
//         subscriber: {
//           email_address: 'test@teat.re',
//           name: {
//             given_name: 'John',
//           },
//         },
//         application_context: {
//           brand_name: 'Subscription to Inctagram',
//           locale: 'en-US',
//           shipping_preference: 'SET_PROVIDED_ADDRESS',
//           user_action: 'SUBSCRIBE_NOW',
//           payment_method: {
//             payer_selected: 'PAYPAL',
//             payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
//           },
//           return_url: 'https://example.com/returnUrl',
//           cancel_url: 'https://example.com/cancelUrl',
//         },
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );
//   }
