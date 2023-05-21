import { Module } from '@nestjs/common';
import { SuperAdminResolver } from './api/super-admin.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { join } from 'node:path';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { BanUserUseCase } from './application/use-cases/ban-user.use-case';

const useCases = [DeleteUserUseCase, BanUserUseCase];

@Module({
  imports: [
    CqrsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        return {
          playground: Boolean(configService.GRAPHQL_PLAYGROUND),
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            dateScalarMode: 'timestamp',
          },
        };
      },
    }),
    UsersModule,
  ],
  providers: [...useCases, SuperAdminResolver],
})
export class SuperAdminModule {}
