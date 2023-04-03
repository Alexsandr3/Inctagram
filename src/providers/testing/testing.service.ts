import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingService {
  constructor(private readonly dataService: DataSource) {}

  /**
   * Truncate all tables in the database
   */
  async truncateDBTables(): Promise<void> {
    const connection = this.dataService;
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  }
}
