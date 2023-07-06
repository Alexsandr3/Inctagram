import { DynamicModule, Global, Module } from '@nestjs/common';
import { AmqpConnectionManager, RabbitMQModule, RabbitRpcParamsFactory } from '@golevelup/nestjs-rabbitmq';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { ampqConfig } from '@common/modules/ampq/ampq.config';
import { IRabbitProducer, RabbitProducer } from '@common/modules/ampq/rabbit.producer';

@Global()
@Module({})
export class AmpqModule {
  static forRootAsync(): DynamicModule {
    return {
      module: AmpqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          imports: [ApiConfigModule],
          inject: [ApiConfigService],
          useFactory: (configService: ApiConfigService) => ampqConfig(configService),
        }),
      ],
      providers: [
        RabbitRpcParamsFactory,
        AmqpConnectionManager,
        {
          provide: IRabbitProducer,
          useClass: RabbitProducer,
        },
      ],
      exports: [RabbitMQModule, IRabbitProducer],
    };
  }
}

// import { DynamicModule, Global, Module } from '@nestjs/common';
// import { AmqpConnectionManager, RabbitMQModule, RabbitRpcParamsFactory } from '@golevelup/nestjs-rabbitmq';
// import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
// import { ApiConfigService } from '@common/modules/api-config/api.config.service';
// import { ampqConfig } from '@common/modules/ampq/ampq.config';
// import { IRabbitProducer, RabbitProducer } from '@common/modules/ampq/rabbit.producer';
//
// @Global()
// @Module({})
// export class AmpqModule {
//   static forRootAsync(exchanges: any[]): DynamicModule {
//     return {
//       module: AmpqModule,
//       imports: [
//         RabbitMQModule.forRootAsync(RabbitMQModule, {
//           imports: [ApiConfigModule],
//           inject: [ApiConfigService],
//           useFactory: (configService: ApiConfigService) => ampqConfig(configService, exchanges),
//         }),
//       ],
//       providers: [
//         RabbitRpcParamsFactory,
//         AmqpConnectionManager,
//         {
//           provide: IRabbitProducer,
//           useClass: RabbitProducer,
//         },
//       ],
//       exports: [RabbitMQModule, IRabbitProducer],
//     };
//   }
// }
