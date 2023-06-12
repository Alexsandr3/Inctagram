import { Module } from '@nestjs/common';
import { SuperAdminResolver } from './api/super-admin.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { UpdateUserStatusUseCase } from './application/use-cases/update-user-status-use.case';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error';
import { PostsModule } from '../posts/posts.module';
import { PostLoader } from './post-loader';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { SubscriptionLoader } from './subscription-loader';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

const useCases = [DeleteUserUseCase, UpdateUserStatusUseCase];
const loaderProviders = [
  PostLoader,
  SubscriptionLoader,
  {
    provide: APP_INTERCEPTOR,
    useClass: DataLoaderInterceptor,
  },
];

@Module({
  imports: [
    CqrsModule,
    ApiConfigModule,
    SubscriptionsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        return {
          playground: Boolean(configService.GRAPHQL_PLAYGROUND),
          autoSchemaFile: true, //join(process.cwd(), 'src/schema.gql'),
          installSubscriptionHandlers: true,
          // context: () => ({
          //   // define the context
          //   postsLoader: createPostsLoader(postsService),
          //   // initialize the postsLoader
          // }),
          buildSchemaOptions: {
            dateScalarMode: 'timestamp',
          },
          formatError: (error: GraphQLError) => {
            const graphQLFormattedError: GraphQLFormattedError = {
              message: error?.message,
              extensions: {
                statusCode: error?.extensions?.statusCode,
              },
              path: error?.path,
            };
            return graphQLFormattedError;
          },
        };
      },
    }),
    UsersModule,
    PostsModule,
  ],
  providers: [...useCases, SuperAdminResolver, ...loaderProviders],
})
export class SuperAdminModule {}
