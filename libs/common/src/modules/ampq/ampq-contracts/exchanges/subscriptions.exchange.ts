import { RabbitExchangeConfigInterface } from '@common/modules/ampq/ampq-contracts/shared/rabbit-exchange-config.interface';

export const EXCHANGE_SUBSCRIPTIONS: RabbitExchangeConfigInterface = {
  name: 'subscriptions',
  type: 'direct',
};
