import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { PrismaClient } from '@prisma/client';
import { truncateDBTablesPrisma } from './truncateDBTablesPrisma';
import { truncateDBTablesTypeOrm } from './truncateDBTablesTypeOrm';
import { defaultE2ETestingOptions, E2ETestingOptions, providersToMock } from './providersToMock';
import { baseAppConfig } from '@common/configuration/app.config';

const prisma = new PrismaClient();

export const getAppForE2ETesting = async (
  mocks: E2ETestingOptions = defaultE2ETestingOptions,
  setupModuleBuilder?: (appModuleBuilder: TestingModuleBuilder) => void,
) => {
  let appModule: TestingModuleBuilder = await Test.createTestingModule({
    imports: [AppModule],
  });
  if (setupModuleBuilder) setupModuleBuilder(appModule);
  //if providersToMock contains typeMock === false, then need add overrideProvider or overrideGuard
  providersToMock.forEach(providerToMock => {
    if (!providerToMock.typeMock) {
      if (providerToMock.typeOverride === 'provider') {
        if (providerToMock.useType === 'value') {
          appModule = appModule.overrideProvider(providerToMock.classToMock).useValue(providerToMock.mockValue);
        } else {
          appModule = appModule.overrideProvider(providerToMock.classToMock).useClass(providerToMock.mockValue);
        }
      } else {
        appModule = appModule.overrideGuard(providerToMock.classToMock).useValue(providerToMock.mockValue);
      }
    }
  });
  const appCompile = await appModule.compile();
  const app = appCompile.createNestApplication();
  baseAppConfig(app);
  await app.init();
  const connection = appCompile.get(DataSource); //If you need to use Prisma, you need to  exchange  PrismaClient instead of DataSource
  await truncateDBTablesTypeOrm(connection);
  await truncateDBTablesPrisma(prisma).finally(async () => {
    await prisma.$disconnect();
  });
  return app;
};
