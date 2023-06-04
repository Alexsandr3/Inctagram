import { EmailAdapter } from '../../src/providers/mailer/email.adapter';
import { GoogleEnterpriseRecaptchaGuard } from '../../src/providers/recaptcha/google-enterprise-recaptcha.guard';
import { GoogleRegistrationGuard } from '../../src/modules/auth/api/guards/google-registration.guard';
import { GitHubRegistrationGuard } from '../../src/modules/auth/api/guards/github-registration.guard';
import { PaymentStripeService } from '../../../business/src/modules/payment/application/payment-stripe.service';
import { PaymentStripeServiceMock } from '../subscriptions/helpers/payment-stripe-service.mock';

export interface E2ETestingOptions {
  useMailer?: boolean;
  useRecaptcha?: boolean;
  useGoogleAuth?: boolean;
  useGitHubAuth?: boolean;
  useStripeService?: boolean;
}

export const defaultE2ETestingOptions: E2ETestingOptions = {
  useMailer: false,
  useRecaptcha: false,
  useGoogleAuth: false,
  useGitHubAuth: false,
  useStripeService: false,
};

interface ProviderToMock {
  typeMock: boolean;
  typeOverride: 'provider' | 'guard';
  useType: 'value' | 'class';
  classToMock: any;
  mockValue: any;
}

export const providersToMock: ProviderToMock[] = [
  {
    typeMock: defaultE2ETestingOptions.useMailer,
    typeOverride: 'provider',
    useType: 'value',
    classToMock: EmailAdapter,
    mockValue: { sendEmail: () => 'SENT EMAIL' },
  },
  {
    typeMock: defaultE2ETestingOptions.useRecaptcha,
    typeOverride: 'guard',
    useType: 'value',
    classToMock: GoogleEnterpriseRecaptchaGuard,
    mockValue: { canActivate: () => true },
  },
  {
    typeMock: defaultE2ETestingOptions.useGoogleAuth,
    typeOverride: 'guard',
    useType: 'value',
    classToMock: GoogleRegistrationGuard,
    mockValue: { canActivate: () => true },
  },
  {
    typeMock: defaultE2ETestingOptions.useGitHubAuth,
    typeOverride: 'guard',
    useType: 'value',
    classToMock: GitHubRegistrationGuard,
    mockValue: { canActivate: () => true },
  },
  {
    typeMock: defaultE2ETestingOptions.useStripeService,
    typeOverride: 'provider',
    useType: 'class',
    classToMock: PaymentStripeService,
    mockValue: PaymentStripeServiceMock,
  },
];
