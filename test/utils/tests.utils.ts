import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appConfig } from '../../src/configuration/app.config';
import { DataSource } from 'typeorm';
import { EmailAdapter } from '../../src/providers/mailer/email.adapter';

// async function truncateDBTables(prisma: PrismaClient): Promise<void> {
//   const models = Object.keys(prisma)
//     .filter(key => prisma[key].hasOwnProperty('model'))
//     .map(key => prisma[key].model);
//   for (const model of models) {
//     await prisma.$executeRaw(
//       `TRUNCATE TABLE "${model.databaseName}"."${model.name}" CASCADE;`,
//     );
//   }
// }

export async function truncateDBTables(connection: DataSource): Promise<void> {
  const entities = connection.entityMetadatas;
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
}

export const getAppForE2ETesting = async (
  mailerOn: boolean,
  setupModuleBuilder?: (appModuleBuilder: TestingModuleBuilder) => void,
) => {
  let appModule: TestingModuleBuilder = await Test.createTestingModule({
    imports: [AppModule],
  });
  if (setupModuleBuilder) setupModuleBuilder(appModule);
  if (!mailerOn) appModule.overrideProvider(EmailAdapter).useValue({ sendEmail: () => 'SENT EMAIL' });
  const appCompile = await appModule.compile();
  const app = appCompile.createNestApplication();
  appConfig(app);
  await app.init();
  const connection = appCompile.get(DataSource); //If you need to use Prisma, you need to  exchange  PrismaClient instead of DataSource
  await truncateDBTables(connection); // очищаем таблицы перед каждым запуском тестов
  return app;
};
