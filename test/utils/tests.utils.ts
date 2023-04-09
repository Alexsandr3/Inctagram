import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appConfig } from '../../src/configuration/app.config';
import { DataSource } from 'typeorm';
import { EmailAdapter } from '../../src/providers/mailer/email.adapter';
import { PrismaClient } from '@prisma/client';

async function truncateDBTablesPrisma(prisma: PrismaClient): Promise<void> {
  const models = Object.keys(prisma)
    .filter(item => {
      return !(item.startsWith('_') || item.endsWith('$extends'));
    })
    .map(str => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
  for (const model of models) {
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE "${model}" CASCADE;`);
  }
}

export async function truncateDBTables(connection: DataSource): Promise<void> {
  const entities = connection.entityMetadatas;
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
}

const prisma = new PrismaClient();

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
  await truncateDBTables(connection);
  await truncateDBTablesPrisma(prisma).finally(async () => {
    await prisma.$disconnect();
  }); // очищаем таблицы перед каждым запуском тестов
  return app;
};
