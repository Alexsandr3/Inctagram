import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource, DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class PluralNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(className: string, customName?: string): string {
    return customName || className.toLowerCase() + 's';
  }
}

export const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'chat',
  entities: [],
  synchronize: false,
  migrations: ['src/db-migration/migrations/*'],
  namingStrategy: new PluralNamingStrategy(),
  logging: true,
  logger: 'file',
};

export default new DataSource(typeOrmConfig);
