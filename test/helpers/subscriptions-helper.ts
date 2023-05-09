import { INestApplication } from '@nestjs/common';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import request from 'supertest';
import { CreateSubscriptionInputDto } from '../../src/modules/subscriptions/api/input-dtos/create-subscription-input.dto';
import { subscriptionsEndpoints } from '../../src/modules/subscriptions/api/routing/subscriptions.routing';
import { SubscriptionViewModel } from '../../src/modules/subscriptions/api/view-model/subscription-view.dto';

export class SubscriptionsHelper {
  constructor(private readonly app: INestApplication) {}

  async createSubscription<T = SubscriptionViewModel>(
    command: CreateSubscriptionInputDto,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 201 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.CREATED_201;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post(subscriptionsEndpoints.createSubscriptions())
      .auth(config.token, { type: 'bearer' })
      .send(command)
      .expect(expectedCode);

    return response.body;
  }
}
