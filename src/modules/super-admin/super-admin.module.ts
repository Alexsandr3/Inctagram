import { Module } from '@nestjs/common';
import { SuperAdminResolver } from './api/super-admin.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { UpdateUserStatusUseCase } from './application/use-cases/update-user-status-use.case';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error';

const useCases = [DeleteUserUseCase, UpdateUserStatusUseCase];

@Module({
  imports: [
    CqrsModule,
    ApiConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        return {
          playground: Boolean(configService.GRAPHQL_PLAYGROUND),
          autoSchemaFile: true, //join(process.cwd(), 'src/schema.gql'),
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            dateScalarMode: 'timestamp',
          },
          formatError: (error: GraphQLError) => {
            console.log('error', error);
            const graphQLFormattedError: GraphQLFormattedError = {
              message: error?.message,
              extensions: {
                statusCode: error?.extensions?.statusCode,
              },
            };
            return graphQLFormattedError;
          },
        };
      },
    }),
    UsersModule,
  ],
  providers: [...useCases, SuperAdminResolver],
})
export class SuperAdminModule {}
