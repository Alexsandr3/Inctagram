import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { RabbitMQConfig, RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

/**
 * AMPQ configuration accepts an array of exchanges and the URI of the broker.
 * @param configService
 * @param exchanges
 */
export const ampqConfig = (configService: ApiConfigService, exchanges: RabbitMQExchangeConfig[]): RabbitMQConfig => {
  const uri = configService.RABBITMQ_URL;
  return {
    exchanges: exchanges,
    uri,
    connectionInitOptions: { wait: false },
    connectionManagerOptions: { heartbeatIntervalInSeconds: 15, reconnectTimeInSeconds: 30 },
  };
};
