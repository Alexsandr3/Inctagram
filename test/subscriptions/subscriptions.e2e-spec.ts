import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { SubscriptionsHelper } from '../helpers/subscriptions-helper';
import { CreateSubscriptionInputDto } from '../../src/modules/subscriptions/api/input-dtos/create-subscription-input.dto';
import { SubscriptionType } from '../../src/modules/subscriptions/types/subscription.type';
import { PaymentMethod } from '../../src/modules/subscriptions/types/payment.method';
import { PaymentSessionUrlViewModel } from '../../src/modules/subscriptions/api/view-model/payment-session-url-view-view.dto';
import { CurrentActiveSubscriptionsViewModel } from '../../src/modules/subscriptions/api/view-model/current-subscriptions-view.dto';
import {
  PricingDetailsViewModel,
  SubscriptionPriceViewModel,
} from '../../src/modules/subscriptions/api/view-model/cost-monthly-subscription-view.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { checkoutSessionCompleted } from './checkout.session.completed';
import { PaymentEventType } from '../../src/main/payment-event.type';

jest.setTimeout(120000);
describe('Testing create subscriptions -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let subscriptionsHelper: SubscriptionsHelper;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
    subscriptionsHelper = new SubscriptionsHelper(app);
    eventEmitter = app.get<EventEmitter2>(EventEmitter2);
  });

  afterAll(async () => {
    await app.close();
  });
  // Registration correct data
  let accessToken: string;
  let correctEmail_first_user = 'admin@admin.com';
  let correctUserName_first_user = 'Takomas';
  let costSubscription: PricingDetailsViewModel[];
  const costMonthlySubscription = 10; //change for tests
  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user, userName: correctUserName_first_user };
    accessToken = await authHelper.createUser(command, { expectedCode: 204 });
  });
  //The user wants all active subscriptions
  it('02 - / (GET) - should get all subscriptions for current user', async () => {
    const body = await subscriptionsHelper.getCurrentSubscriptions<CurrentActiveSubscriptionsViewModel>({
      token: accessToken,
      expectedCode: 200,
    });
    expect(body).toEqual(expect.any(Object));
    expect(body.hasAutoRenewal).toBe(false);
    expect(body.data).toHaveLength(0);
  });
  //Get the cost of the subscription
  it('03 - / (GET) - should return the cost of the subscription with status 200', async () => {
    const body = await subscriptionsHelper.getCurrentCostSubscription<SubscriptionPriceViewModel>({
      expectedCode: 200,
    });
    expect(body.data).toHaveLength(3);
    expect(body.data[0].amount).toEqual(costMonthlySubscription);
    expect(body.data[0].typeDescription).toEqual(SubscriptionType.MONTHLY);
    expect(body.data[1].amount).toEqual(costMonthlySubscription * 5);
    expect(body.data[1].typeDescription).toEqual(SubscriptionType.SEMI_ANNUALLY);
    expect(body.data[2].amount).toEqual(costMonthlySubscription * 10);
    expect(body.data[2].typeDescription).toEqual(SubscriptionType.YEARLY);
    costSubscription = body.data;
  });

  //Create a subscription
  it('04 - / (POST) - should create subscriptions for current user', async () => {
    const command: CreateSubscriptionInputDto = {
      typeSubscription: SubscriptionType.MONTHLY,
      paymentType: PaymentMethod.STRIPE,
      amount: costSubscription[0].amount,
    };
    const subscription = await subscriptionsHelper.createSubscription<PaymentSessionUrlViewModel>(command, {
      token: accessToken,
      expectedCode: 201,
    });
    expect(subscription.url).toEqual(expect.any(String));
    //call success payment event
    eventEmitter.emit(PaymentEventType.successSubscription, checkoutSessionCompleted.data.object);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  //Get all active subscriptions
  it('05 - / (GET) - should get all subscriptions for current user', async () => {
    const body = await subscriptionsHelper.getCurrentSubscriptions<CurrentActiveSubscriptionsViewModel>({
      token: accessToken,
      expectedCode: 200,
    });
    expect(body).toEqual(expect.any(Object));
    expect(body.hasAutoRenewal).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].endDateOfSubscription).toEqual(expect.any(String));
    expect(body.data[0].autoRenewal).toBe(true);
  });
  //Get me info hasBusinessAccount
  it('06 - / (GET) - should return 200 and info about logged user', async () => {
    const myInfo = await authHelper.me(accessToken);
    expect(myInfo).toEqual(expect.any(Object));
    expect(myInfo.email).toEqual(correctEmail_first_user);
    expect(myInfo.userName).toEqual(correctUserName_first_user);
    expect(myInfo.hasBusinessAccount).toBe(true);
  });
  //Delete autoRenewal
  it('07 - / (DELETE) - should delete autoRenewal for current user', async () => {
    await subscriptionsHelper.canceledAutoRenewal({ token: accessToken, expectedCode: 204 });
  });
  it('08 - / (GET) - should get all subscriptions for current user', async () => {
    const body = await subscriptionsHelper.getCurrentSubscriptions<CurrentActiveSubscriptionsViewModel>({
      token: accessToken,
      expectedCode: 200,
    });
    expect(body).toEqual(expect.any(Object));
    expect(body.hasAutoRenewal).toBe(false);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].endDateOfSubscription).toEqual(expect.any(String));
    expect(body.data[0].autoRenewal).toBe(false);
  });
  /* //Check the status of the subscription after 1 month
  it('09 - / (GET) - should get all subscriptions for current user', async () => {
    jest.useFakeTimers();
    //after 1 month
    jest.advanceTimersByTime(1000 * 60 * 60 * 24 * 30);
    await new Promise(resolve => setTimeout(resolve, 6000));
    const command: LoginInputDto = { email: correctEmail_first_user, password: '12345678' };
    const accessToken2 = await authHelper.login(command, { expectedCode: 200 });
    const body = await subscriptionsHelper.getCurrentSubscriptions<CurrentActiveSubscriptionsViewModel>({
      token: accessToken2,
      expectedCode: 200,
    });
    console.log(body);
  });*/
});

/*  it.skip('04 - / (POST) - should create subscriptions for current user', async () => {
  const command: CreateSubscriptionInputDto = {
    typeSubscription: SubscriptionType.MONTHLY,
    paymentType: PaymentMethod.STRIPE,
    amount: costMonthlySubscription,
  };
  const paymentStripeService = app.get<PaymentStripeService>(PaymentStripeService);
  const sessionFromStripe = jest.spyOn(paymentStripeService, 'createSession');
  const subscription = await subscriptionsHelper.createSubscription<PaymentSessionUrlViewModel>(command, {
    token: accessToken,
    expectedCode: 201,
  });
  const { value } = sessionFromStripe.mock.results[0];
  expect(paymentStripeService.createSession).toBeCalled();
  expect(subscription.url).toEqual(expect.any(String));
  customerId = value.customer as string;
  sessionId = value.id as string;
});*/
