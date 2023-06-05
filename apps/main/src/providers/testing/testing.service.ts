import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TestingService {
  prisma = new PrismaClient();
  constructor() {}

  /**
   * Truncate all tables in the database
   */
  async truncateDBTables(): Promise<void> {
    const models = Object.keys(this.prisma)
      .filter(item => {
        return !(item.startsWith('_') || item.endsWith('$extends'));
      })
      .map(str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      })
      .map(model => model + 's');
    for (const model of models) {
      await this.prisma.$queryRawUnsafe(`TRUNCATE TABLE "${model}" CASCADE;`);
    }
  }
}

// async truncateDBTables(): Promise<void> {
//   const connection = this.dataService;
//   const entities = connection.entityMetadatas;
//   for (const entity of entities) {
//   const repository = connection.getRepository(entity.name);
//   await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
// }
// }
