export const baseUrlSubscriptions = '/subscriptions';
/**
 * subscriptionsEndpoints:
 * getCurrentCostSubscription - 'GET';
 * createSubscriptions - 'POST';
 * getCurrentSubscription - 'GET';
 * getMyPayments - 'GET';
 * canceledAutoRenewal - 'POST';
 */

export const subscriptionsEndpoints = {
  getCurrentCostSubscription: () => `${baseUrlSubscriptions}/cost-of-subscriptions`,
  createSubscriptions: () => `${baseUrlSubscriptions}`,
  getCurrentSubscriptions: () => `${baseUrlSubscriptions}/current-subscriptions`,
  getMyPayments: () => `${baseUrlSubscriptions}/my-payments`,
  canceledAutoRenewal: () => `${baseUrlSubscriptions}/canceled-auto-renewal`,
  stripeHook: () => `/payments/stripe/webhook`,
};
