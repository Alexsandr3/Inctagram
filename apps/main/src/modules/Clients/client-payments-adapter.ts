import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { CreateSessionRequestInterface } from '@common/main/types/create-session-interface.type';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class ClientPaymentsAdapter {
  urlServicePayments: string;
  constructor(private readonly configService: ApiConfigService) {
    this.urlServicePayments = this.configService.SERVER_URL_PAYMENTS;
  }

  async createSession<T>(data: CreateSessionRequestInterface): Promise<T> {
    const response = await axios.post(`${this.urlServicePayments}/payments`, data, {});
    return this._handleResponse(response);
  }

  private async _handleResponse(response: AxiosResponse) {
    switch (response.status) {
      case 200:
      case 201:
        return response.data;
      case 204:
        return;
      case 400:
        throw new Error('Bad Request');
      default:
        const errorMessage = await response.data.error.message;
        throw new Error(errorMessage);
    }
  }

  async findSubscriptions(stipeCustomerId: string): Promise<any> {
    const response = await axios.get(`${this.urlServicePayments}/payments/subscriptions/${stipeCustomerId}`);
    return this._handleResponse(response);
  }

  async cancelSubscription(id: string): Promise<any> {
    const response = await axios.delete(`${this.urlServicePayments}/payments/subscriptions/${id}`);
    return this._handleResponse(response);
  }
}
