import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appConfig } from '../../src/configuration/app.config';

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

export const getAppForE2ETesting = async (
  setupModuleBuilder?: (appModuleBuilder: TestingModuleBuilder) => void,
) => {
  const appModule: TestingModuleBuilder = await Test.createTestingModule({
    imports: [AppModule],
  });

  if (setupModuleBuilder) {
    setupModuleBuilder(appModule);
    const appModuleCompile = await appModule.compile();
    const app = appModuleCompile.createNestApplication();
    appConfig(app);
    await app.init();
    // const connection = appModuleCompile.get(PrismaClient);
    // await truncateDBTables(connection); // очищаем таблицы перед каждым запуском тестов
    return app;
  } else {
    const appCompile = await appModule.compile();
    const app = appCompile.createNestApplication();
    appConfig(app);
    await app.init();
    // const connection = appCompile.get(PrismaClient);
    // await truncateDBTables(connection); // очищаем таблицы перед каждым запуском тестов
    return app;
  }
};
