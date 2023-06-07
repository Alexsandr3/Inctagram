import { DynamicModule, Global, Module } from '@nestjs/common';
import { AmqpConnectionManager, RabbitMQModule, RabbitRpcParamsFactory } from '@golevelup/nestjs-rabbitmq';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { ampqConfig } from '@common/modules/ampq/ampq.config';

@Global()
@Module({})
export class AmpqModule {
  static forRoot(exchanges: any[]): DynamicModule {
    return {
      module: AmpqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          imports: [ApiConfigModule],
          inject: [ApiConfigService],
          useFactory: (configService: ApiConfigService) => ampqConfig(configService, exchanges),
        }),
      ],
      providers: [RabbitRpcParamsFactory, AmqpConnectionManager],
      exports: [RabbitMQModule],
    };
  }
}
