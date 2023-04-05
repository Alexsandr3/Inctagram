import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { AuthHelper } from '../helpers/auth-helper';

describe('Clients-admin e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting(false);
    authHelper = new AuthHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register user and send email', async () => {
    await authHelper.registration();
  });
  it.skip('should confirm registration', async () => {
    const result: { route: string; status: string } = await authHelper.registrationConfirmation();
    expect(result.status).toBe('OK');
  });
  it.skip('should login user', async () => {
    const result: { route: string; status: string } = await authHelper.login();
    expect(result.status).toBe('OK');
  });
  it.skip('should resend confirmation email', async () => {
    const result: { route: string; status: string } = await authHelper.registrationEmailResending();
    expect(result.status).toBe('OK');
  });
  it.skip('should send recovery password email', async () => {
    const result: { route: string; status: string } = await authHelper.passwordRecovery();
    expect(result.status).toBe('OK');
  });
  it('should resend recovery password email', async () => {
    await authHelper.passwordRecoveryEmailResending();
  });
  it.skip('should set new password', async () => {
    const result: { route: string; status: string } = await authHelper.newPassword();
    expect(result.status).toBe('OK');
  });
  it.skip('should logout user', async () => {
    const result: { route: string; status: string } = await authHelper.logout();
    expect(result.status).toBe('OK');
  });
});
