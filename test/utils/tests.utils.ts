import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { baseAppConfig } from '../../src/configuration/app.config';
import { DataSource } from 'typeorm';
import { PrismaClient } from '@prisma/client';
import { EmailAdapter } from '../../src/providers/mailer/email.adapter';
import { GoogleEnterpriseRecaptchaGuard } from '../../src/providers/recaptcha/google-enterprise-recaptcha.guard';
import { GoogleRegistrationGuard } from '../../src/modules/auth/api/guards/google-registration.guard';
import { truncateDBTablesPrisma } from './truncateDBTablesPrisma';
import { truncateDBTablesTypeOrm } from './truncateDBTablesTypeOrm';
import { GitHubRegistrationGuard } from '../../src/modules/auth/api/guards/github-registration.guard';
import { PaymentStripeService } from '../../src/providers/payment/application/payment-stripe.service';
import { PaymentStripeServiceMock } from '../subscriptions/payment-stripe-service.mock';

const prisma = new PrismaClient();

export interface E2ETestingOptions {
  useMailer?: boolean;
  useRecaptcha?: boolean;
  useGoogleAuth?: boolean;
  useGitHubAuth?: boolean;
  useStripeService?: boolean;
}

const defaultE2ETestingOptions: E2ETestingOptions = {
  useMailer: false,
  useRecaptcha: false,
  useGoogleAuth: false,
  useGitHubAuth: false,
  useStripeService: false,
};

export const getAppForE2ETesting = async (
  mocks: E2ETestingOptions = defaultE2ETestingOptions,
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
  if (!mocks.useStripeService) appModule.overrideProvider(PaymentStripeService).useClass(PaymentStripeServiceMock);
  // appModule.overrideProvider(PaymentStripeService).useValue({ createSession: () => sessionTestType });
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

// const providersToMock = new Map<any, { useValue: any }>([
//   [EmailAdapter, { useValue: { sendEmail: () => 'SENT EMAIL' } }],
//   [GoogleEnterpriseRecaptchaGuard, { useValue: { canActivate: () => true } }],
//   [GoogleRegistrationGuard, { useValue: { canActivate: () => true } }],
//   [GitHubRegistrationGuard, { useValue: { canActivate: () => true } }],
//   [PaymentStripeService, { useValue: { createSession: () => sessionTestType } }],
// ]);
// for (const provider of providersToMock) {
//   const { classToMock, mockValue } = provider;
//   console.log('-----', mocks.hasOwnProperty(classToMock.name));
//   console.log('+++++', !mocks[classToMock.name]);
//   if (mocks.hasOwnProperty(classToMock.name) && !mocks[classToMock.name]) {
//     appModule.overrideProvider(classToMock).useValue(mockValue);
//   }
// }
// interface ProviderToMock {
//   classToMock: any;
//   mockValue: any;
// }
//
// const providersToMock: ProviderToMock[] = [
//   { classToMock: EmailAdapter, mockValue: { sendEmail: () => 'SENT EMAIL' } },
//   { classToMock: GoogleEnterpriseRecaptchaGuard, mockValue: { canActivate: () => true } },
//   { classToMock: GoogleRegistrationGuard, mockValue: { canActivate: () => true } },
//   { classToMock: GitHubRegistrationGuard, mockValue: { canActivate: () => true } },
//   // { classToMock: PaymentStripeService, mockValue: { createSession: () => sessionTestType } },
// ];
