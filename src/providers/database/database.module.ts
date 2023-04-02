import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { ApiConfigService } from '../../modules/api-config/api.config.service';
import DatabaseLogger from './utils/databaseLogger';

export class PluralNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(className: string, customName?: string): string {
    return customName || className.toLowerCase() + 's';
  }
}

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
