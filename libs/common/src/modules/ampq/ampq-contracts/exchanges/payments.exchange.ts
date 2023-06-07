import { RabbitExchangeConfigInterface } from '@common/modules/ampq/ampq-contracts/shared/rabbit-exchange-config.interface';

export const EXCHANGE_PAYMENTS: RabbitExchangeConfigInterface = {
  name: 'payments',
  type: 'direct',
};
