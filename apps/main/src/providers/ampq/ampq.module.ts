// import { Global, Module } from '@nestjs/common';
// import {
//   AmqpConnection,
//   AmqpConnectionManager,
//   RabbitMQExchangeConfig,
//   RabbitMQModule,
//   RabbitRpcParamsFactory,
// } from '@golevelup/nestjs-rabbitmq';
// import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
// import { ApiConfigService } from '@common/modules/api-config/api.config.service';
// import { ampqConfig } from '@common/modules/ampq/ampq.config';
// import { EXCHANGE_IMAGES } from '@common/modules/ampq/ampq-contracts/exchanges/images.exchange';
// import { EXCHANGE_SUBSCRIPTIONS } from '@common/modules/ampq/ampq-contracts/exchanges/subscriptions.exchange';
//
// const AMPQ_EXCHANGES: RabbitMQExchangeConfig[] = [EXCHANGE_IMAGES, EXCHANGE_SUBSCRIPTIONS];
// @Global()
// @Module({
//   imports: [
//     RabbitMQModule.forRootAsync(RabbitMQModule, {
//       imports: [ApiConfigModule],
//       inject: [ApiConfigService],
//       useFactory: (configService: ApiConfigService) => ampqConfig(configService, AMPQ_EXCHANGES),
//     }),
//   ],
//   providers: [RabbitRpcParamsFactory, AmqpConnectionManager, AmqpConnection],
//   exports: [AmpqModule],
// })
// export class AmpqModule {}
