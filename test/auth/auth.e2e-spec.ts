import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { AuthHelper } from '../helpers/auth-helper';
import { ApiErrorResultDto } from '../../src/main/validators/api-error-result.dto';

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

  //Incorrect data
  //auth/registration
  it('01 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { password: '12345678', email: 'Doe' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('02 - / (POST) - should return 400 if password is incorrect', async () => {
    const command = { password: 'qwert', email: 'fortesting@jive.com' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('03 - / (POST) - should return 400 if email and password is incorrect', async () => {
    const command = { password: 'qwert', email: 'Doe' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(2);
    expect(response.messages[0].field).toBe('password');
    expect(response.messages[1].field).toBe('email');
  });
  it('04 - / (POST) - should return 400 if email is empty', async () => {
    const command = { password: '', email: 'fortesting@jive.com' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('05 - / (POST) - should return 400 if password is empty', async () => {
    const command = { password: '1234567', email: '' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('06 - / (POST) - should return 400 if email not unique', async () => {
    const command = { password: '12345678', email: 'correct@eamil.co' };
    await authHelper.registrationUser(command, { expectedCode: 204 });
    const response2: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response2.messages).toHaveLength(1);
    expect(response2.messages[0].field).toBe('email');
  });
  //auth/registration-confirmation
  it('07 - / (POST) - should return 400 if confirmationCode is empty', async () => {
    const command = { confirmationCode: '' };
    const response: ApiErrorResultDto = await authHelper.registrationConfirmation(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('confirmationCode');
  });
  //auth/registration-email-resending
  it('08 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { email: 'validvalidamail.tr' };
    const response: ApiErrorResultDto = await authHelper.registrationEmailResending(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('09 - / (POST) - should return 400 if email is empty', async () => {
    const command = { email: '' };
    const response: ApiErrorResultDto = await authHelper.registrationEmailResending(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  //auth/login
  it('10 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { password: '12345678', email: 'Doe' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('login, email or password');
  });
  it('11 - / (POST) - should return 400 if password is incorrect', async () => {
    const command = { password: '', email: 'dafsfd@dsaff.te' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('login, email or password');
  });
  it('12 - / (POST) - should return 401 if user not unauthorized', async () => {
    const command = { password: '12345678', email: 'Doe@doede.he' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 401 });
    expect(response.messages).toHaveLength(0);
    expect(response.error).toBe('Unauthorized');
  });
  //auth/password-recovery
  it('13 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { email: 'validvalidamail.tr', recaptcha: '12345678' };
    const response: ApiErrorResultDto = await authHelper.passwordRecovery(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('14 - / (POST) - should return 400 if email is empty', async () => {
    const command = { email: '', recaptcha: '12345678' };
    const response: ApiErrorResultDto = await authHelper.passwordRecovery(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('15 - / (POST) - should return 400 if recaptcha is empty', async () => {
    const command = { email: 'validva@lidamail.tr', recaptcha: '' };
    const response: ApiErrorResultDto = await authHelper.passwordRecovery(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('recaptcha');
  });
  //auth/check-recovery-code
  it('16 - / (POST) - should return 400 if recoveryCode is empty', async () => {
    const command = { recoveryCode: '' };
    const response: ApiErrorResultDto = await authHelper.checkPasswordRecovery(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('recoveryCode');
  });
  //auth/new-password
  it('17 - / (POST) - should return 400 if password is incorrect', async () => {
    const command = { newPassword: 'qwert', recoveryCode: '12345678' };
    const response: ApiErrorResultDto = await authHelper.newPassword(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('newPassword');
    //newPassword long 20
    const command2 = { newPassword: 'qwertqwertqwertqwertqwert', recoveryCode: '12345678' };
    const response2: ApiErrorResultDto = await authHelper.newPassword(command2, { expectedCode: 400 });
    expect(response2.messages).toHaveLength(1);
    expect(response2.messages[0].field).toBe('newPassword');
  });
  it('18 - / (POST) - should return 400 if recoveryCode is empty', async () => {
    const command = { newPassword: 'qwertys', recoveryCode: '' };
    const response: ApiErrorResultDto = await authHelper.newPassword(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('recoveryCode');
  });
  //auth/logout
  it('19 - / (POST) - should return 401 if user not unauthorized', async () => {});

  // Registration correct data
  it('007 - / (POST) - should return 201 if email and password is correct', async () => {
    const command = { password: '12345678', email: 'correct@gaamaam.re' };
    await authHelper.registrationUser(command, { expectedCode: 204 });
  });
});
