import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { RabbitMQConfig, RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGE_INCTAGRAM } from '@common/modules/ampq/ampq-contracts/consts/inctagram.exchange';

const AMPQ_EXCHANGES: RabbitMQExchangeConfig[] = [EXCHANGE_INCTAGRAM];

/**
 * AMPQ configuration accepts an array of exchanges and the URI of the broker.
 * @param configService
 */
export const ampqConfig = (configService: ApiConfigService): RabbitMQConfig => {
  const uri = configService.RABBITMQ_URL;
  return {
    exchanges: AMPQ_EXCHANGES,
    uri,
    prefetchCount: 1,
    // connectionInitOptions: { wait: false },
    // connectionManagerOptions: { heartbeatIntervalInSeconds: 15, reconnectTimeInSeconds: 30 },
  };
};
