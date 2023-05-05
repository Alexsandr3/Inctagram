import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { baseAppConfig } from '../../src/configuration/app.config';
import { DataSource } from 'typeorm';
import { EmailAdapter } from '../../src/providers/mailer/email.adapter';
import { PrismaClient } from '@prisma/client';
import { GoogleEnterpriseRecaptchaGuard } from '../../src/providers/recaptcha/google-enterprise-recaptcha.guard';
import { GoogleRegistrationGuard } from '../../src/modules/auth/api/guards/google-registration.guard';
import { GitHubRegistrationGuard } from '../../src/modules/auth/api/guards/github-registration.guard';

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
  mocks: { useMailer?: boolean; useRecaptcha?: boolean; useGoogleAuth?: boolean; useGitHubAuth?: boolean } = {
    useMailer: false,
    useRecaptcha: false,
    useGoogleAuth: false,
    useGitHubAuth: false,
  },
  setupModuleBuilder?: (appModuleBuilder: TestingModuleBuilder) => void,
) => {
  let appModule: TestingModuleBuilder = await Test.createTestingModule({
    imports: [AppModule],
  });
  if (setupModuleBuilder) setupModuleBuilder(appModule);
  if (!mocks.useMailer) appModule.overrideProvider(EmailAdapter).useValue({ sendEmail: () => 'SENT EMAIL' });
  if (!mocks.useRecaptcha)
    appModule.overrideGuard(GoogleEnterpriseRecaptchaGuard).useValue({ canActivate: () => true });
  if (!mocks.useGoogleAuth) appModule.overrideGuard(GoogleRegistrationGuard).useValue({ canActivate: () => true });
  if (!mocks.useGitHubAuth) appModule.overrideGuard(GitHubRegistrationGuard).useValue({ canActivate: () => true });
  const appCompile = await appModule.compile();
  const app = appCompile.createNestApplication();
  baseAppConfig(app);
  await app.init();
  const connection = appCompile.get(DataSource); //If you need to use Prisma, you need to  exchange  PrismaClient instead of DataSource
  await truncateDBTables(connection);
  await truncateDBTablesPrisma(prisma).finally(async () => {
    await prisma.$disconnect();
  }); // очищаем таблицы перед каждым запуском тестов
  return app;
};
