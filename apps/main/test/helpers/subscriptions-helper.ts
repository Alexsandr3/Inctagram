import { INestApplication } from '@nestjs/common';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import request from 'supertest';
import { CreateSubscriptionInputDto } from '../../src/modules/subscriptions/api/input-dtos/create-subscription-input.dto';
import { subscriptionsEndpoints } from '../../src/modules/subscriptions/api/routing/subscriptions.routing';
import { PaymentSessionUrlViewModel } from '../../src/modules/subscriptions/api/view-model/payment-session-url-view-view.dto';

export class SubscriptionsHelper {
  constructor(private readonly app: INestApplication) {}

  async createSubscription<T = PaymentSessionUrlViewModel>(
    command: CreateSubscriptionInputDto,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 201 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.CREATED_201;
    const response = await request(this.app.getHttpServer())
      .post(subscriptionsEndpoints.createSubscriptions())
      .auth(config.token, { type: 'bearer' })
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async getCurrentSubscriptions<T>(
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    const response = await request(this.app.getHttpServer())
      .get(subscriptionsEndpoints.getCurrentSubscriptions())
      .auth(config.token, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }
  async getCurrentCostSubscription<T>(
    config: {
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    const response = await request(this.app.getHttpServer())
      .get(subscriptionsEndpoints.getCurrentCostSubscription())
      .expect(expectedCode);

    return response.body;
  }

  async canceledAutoRenewal(
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<void> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    const response = await request(this.app.getHttpServer())
      .post(subscriptionsEndpoints.canceledAutoRenewal())
      .auth(config.token, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }
}
