import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { SubscriptionsHelper } from '../helpers/subscriptions-helper';
import { CreateSubscriptionInputDto } from '../../src/modules/subscriptions/api/input-dtos/create-subscription-input.dto';
import { SubscriptionType } from '../../src/modules/subscriptions/types/subscription.type';
import { PaymentMethod } from '../../src/modules/subscriptions/types/payment.method';

jest.setTimeout(120000);
describe('Testing create subscriptions -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let subscriptionsHelper: SubscriptionsHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
    subscriptionsHelper = new SubscriptionsHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // Registration correct data
  let accessToken: string;
  let correctEmail_first_user = 'Mariarti92@raccoon.bl';
  let correctUserName_first_user = 'Takomas';
  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user, userName: correctUserName_first_user };
    accessToken = await authHelper.createUser(command, { expectedCode: 204 });
  });
  it('02 - / (POST) - should create subscriptions for current user', async () => {
    const command: CreateSubscriptionInputDto = {
      typeSubscription: SubscriptionType.MONTHLY,
      paymentType: PaymentMethod.STRIPE,
      autoRenew: true,
      amount: 9,
    };
    const subscription = await subscriptionsHelper.createSubscription(command, {
      token: accessToken,
      expectedCode: 201,
    });
  });
  it('03 - / (POST) - should create subscriptions for current user', async () => {
    const command: CreateSubscriptionInputDto = {
      typeSubscription: SubscriptionType.MONTHLY,
      paymentType: PaymentMethod.STRIPE,
      autoRenew: true,
      amount: 10,
    };
    const subscription = await subscriptionsHelper.createSubscription(command, {
      token: accessToken,
      expectedCode: 201,
    });
    console.log(subscription);
  });
});
