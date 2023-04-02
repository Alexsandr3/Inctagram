import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { ApiConfigService } from '../../modules/api-config/api.config.service';
import DatabaseLogger from './utils/databaseLogger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        const url = configService.DATABASE_URL;
        return {
          type: 'postgres',
          logger: new DatabaseLogger(),
          // entities: [...entities],
          url: url,
          autoLoadEntities: true,
          synchronize: true,
          // ssl: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
