import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { AuthHelper } from '../helpers/auth-helper';
import { ApiErrorResultDto } from '../../src/main/validators/api-error-result.dto';
import { MailManager } from '../../src/providers/mailer/application/mail-manager.service';
import { EmailAdapter } from '../../src/providers/mailer/email.adapter';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';

jest.setTimeout(120000);
describe('Authorisation -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  // let mailManager: MailManager;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  //Incorrect data

  //auth/registration
  it('01 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { password: '12345678', email: 'Doe', userName: 'DoeName' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('02 - / (POST) - should return 400 if password is incorrect', async () => {
    const command = { password: 'qwert', email: 'fortesting@jive.com', userName: 'DoeName' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('03 - / (POST) - should return 400 if email and password is incorrect', async () => {
    const command = { password: 'qwert', email: 'Doe', userName: 'DoeName' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(2);
    expect(response.messages[1].field).toBe('password');
    expect(response.messages[0].field).toBe('email');
  });
  it('03_1 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { password: 'qwerty', email: 'fortesting@jive.com', userName: '' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('userName');
  });
  it('03_2 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { password: 'qwerty', email: 'fortesting@jive.com', userName: 'Doe' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('userName');
  });
  it('03_3 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { password: 'qwerty', email: 'fortesting@jive.com', userName: 'D'.repeat(31) };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('userName');
  });
  it('04 - / (POST) - should return 400 if email is empty', async () => {
    const command = { password: '', email: 'fortesting@jive.com', userName: 'DoeName' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('05 - / (POST) - should return 400 if password is empty', async () => {
    const command = { password: '1234567', email: '', userName: 'DoeName' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('06 - / (POST) - should return 400 if email or userName not unique', async () => {
    const command = { password: '12345678', email: 'correct@eamil.co', userName: 'DoeName' };
    await authHelper.registrationUser(command, { expectedCode: 204 });
    const response2: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response2.messages).toHaveLength(1);
    expect(response2.messages[0].field).toBe('userName');
    const command3 = { password: '12345678', email: 'correct@eamil.co', userName: 'CatName' };
    const response3: ApiErrorResultDto = await authHelper.registrationUser(command3, { expectedCode: 400 });
    expect(response3.messages).toHaveLength(1);
    expect(response3.messages[0].field).toBe('email');
  });
  //auth/registration-confirmation
  it('07 - / (POST) - should return 400 if confirmationCode is empty', async () => {
    const command = { confirmationCode: '' };
    const response: ApiErrorResultDto = await authHelper.registrationConfirmation(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('confirmationCode');
  });
  it('07_1 - / (POST) - should return 400 if confirmationCode is incorrect', async () => {
    const command = { confirmationCode: 'e'.repeat(100 + 1) };
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
    expect(response.messages[0].field).toBe('email');
  });
  it('11 - / (POST) - should return 400 if password is incorrect', async () => {
    const command = { password: '', email: 'dafsfd@dsaff.te' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('12 - / (POST) - should return 401 if user not unauthorized', async () => {
    const command = { password: '12345678', email: 'Doe@doede.he' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 401 });
    expect(response.messages).toHaveLength(1);
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
  it('19 - / (POST) - should return 401 if user not unauthorized', async () => {
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ90.' +
      'eyJ1c2VySWQiOjMwMiwiaWF0IjoxNjgwOTUzMDUzLCJleHAiOjE2ODEwMzk0NTN9.' +
      '9k9OHxm74NydJP9XFLHMAZcu06-_KvN5YRcw-ASYgvk';
    const response = await authHelper.logout({ expectedCode: 401, expectedBody: invalidToken });
    expect(response.error).toBe('Unauthorized');
  });
  //auth/refresh-token
  it('20 - / (POST) - should return 401 if user not unauthorized', async () => {
    const response: ApiErrorResultDto = await authHelper.refreshToken({ expectedCode: 401 });
    expect(response.messages).toHaveLength(1);
    expect(response.error).toBe('Unauthorized');
  });

  // Registration correct data
  let correctEmail: string;
  let correctPassword: string;
  let userName: string;
  let confirmationCode: string;
  it('30 - / (POST) - should return 204 if email and password is correct', async () => {
    correctEmail = 'test@test.ts';
    correctPassword = '12345678';
    userName = 'raccoon';
    const mailManager = app.get<MailManager>(MailManager);
    const emailAdapter = app.get<EmailAdapter>(EmailAdapter);
    jest.spyOn(emailAdapter, 'sendEmail');
    const sendEmailConfirmationMessage = jest.spyOn(mailManager, 'sendUserConfirmation');
    const command = { password: correctPassword, email: correctEmail, userName };
    await authHelper.registrationUser(command, { expectedCode: 204 });
    confirmationCode = sendEmailConfirmationMessage.mock.lastCall[1];
    expect(emailAdapter.sendEmail).toBeCalled();
  });
  // Registration confirmation
  it('31 - / (POST) - should return 204 if confirmationCode is correct', async () => {
    const command = { confirmationCode: confirmationCode };
    await authHelper.registrationConfirmation(command, { expectedCode: 204 });
  });
  //Login correct data
  let refreshToken: string;
  let accessToken: string;
  it('32 - / (POST) - should return 200 if password and email correct', async () => {
    const command = { password: correctPassword, email: correctEmail };
    const response = await authHelper.login(command, { expectedCode: 200 });
    refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

    expect(response.body.accessToken).toBeDefined();
    expect(response.body).toEqual({ accessToken: expect.any(String) });
    accessToken = response.body.accessToken;
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toContain('Path=/');
    expect(response.headers['set-cookie'][0]).toContain('Secure');
  });

  //Get myInfo
  it('32.1 - / (GET) - should return 200 and info about logged user', async () => {
    const myInfo = await authHelper.me(accessToken);
    expect(myInfo).toEqual({ userId: expect.any(Number), userName, email: correctEmail });
  });
  it('32.2 - / (GET) - should return 401 if user not authorized', async () => {
    await authHelper.me('bad accessToken', HTTP_Status.UNAUTHORIZED_401);
  });

  //Logout correct data
  it('34 - / (POST) - should return 204 if user authorized', async () => {
    await authHelper.logout({ expectedCode: 204, expectedBody: refreshToken });
  });
  it('35 - / (POST) - should return 401 if user is already logout', async () => {
    const response: ApiErrorResultDto = await authHelper.logout({ expectedCode: 401, expectedBody: refreshToken });
    expect(response.error).toBe('Unauthorized');
  });
  //Password recovery
  let recoveryCode: string;
  let sendEmail: string;
  it('35 - / (POST) - should return 204 if email correct', async () => {
    const mailManager = app.get<MailManager>(MailManager);
    const emailAdapter = app.get<EmailAdapter>(EmailAdapter);
    jest.spyOn(emailAdapter, 'sendEmail');
    const sendEmailConfirmationMessage = jest.spyOn(mailManager, 'sendPasswordRecoveryMessage');
    const command = { email: correctEmail, recaptcha: correctPassword };
    await authHelper.passwordRecovery(command, { expectedCode: 204 });
    sendEmail = sendEmailConfirmationMessage.mock.lastCall[0];
    recoveryCode = sendEmailConfirmationMessage.mock.lastCall[1];
    expect(emailAdapter.sendEmail).toBeCalled();
  });
  //Check recovery code
  it('36 - / (POST) - should return 400 if recoveryCode incorrect', async () => {
    const command = { recoveryCode: '12345678' };
    const response: ApiErrorResultDto = await authHelper.checkPasswordRecovery(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('code');
  });
  it('37 - / (POST) - should return 204 if recoveryCode correct', async () => {
    const command = { recoveryCode: recoveryCode };
    const response = await authHelper.checkPasswordRecovery(command, { expectedCode: 200 });
    expect(response.email).toBe(sendEmail);
  });
  //New password
  it('38 - / (POST) - should return 204 if password and recoveryCode correct', async () => {
    const command = { newPassword: 'newPassword', recoveryCode: recoveryCode };
    await authHelper.newPassword(command, { expectedCode: 204 });
  });
  //Login with new password
  let freshRefreshToken: string;
  it('39 - / (POST) - should return 200 if password and email correct', async () => {
    const command = { password: 'newPassword', email: correctEmail };
    const response = await authHelper.login(command, { expectedCode: 200 });
    freshRefreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toContain('Path=/');
    expect(response.headers['set-cookie'][0]).toContain('Secure');
  });

  //Incorrect data

  //Login with old password
  it('40 - / (POST) - should return 401 if password incorrect', async () => {
    const command = { password: correctPassword, email: correctEmail };
    const response = await authHelper.login(command, { expectedCode: 401 });
    expect(response.error).toBe('Unauthorized');
  });
  //Login with incorrect email
  it('41 - / (POST) - should return 400 if email incorrect', async () => {
    const command = { password: 'newPassword', email: 'incorrectEmail' };
    const response = await authHelper.login(command, { expectedCode: 400 });
    expect(response.error).toBe('Bad Request');
  });
  //Registration incorrect data
  it('42 - / (POST) - should return 400 if email incorrect', async () => {
    const command = { password: correctPassword, email: 'incorrectEmail', userName: 'raccoon' };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });

  //Refresh token
  it('43 - / (POST) - should return 200 if refreshToken correct', async () => {
    const response = await authHelper.refreshToken({ expectedCode: 200, expectedBody: freshRefreshToken });
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toContain('Path=/');
    expect(response.headers['set-cookie'][0]).toContain('Secure');
  });
  it.skip('44 - / (POST) - should return 401 if refreshToken expired', async () => {
    jest.useFakeTimers();
    jest.advanceTimersByTime(10000);
    const response = await authHelper.refreshToken({ expectedCode: 401, expectedBody: refreshToken });
    expect(response.error).toBe('Unauthorized');
  });

  // New register data
  it('45 - / (POST) - should register user and resend email', async () => {
    correctEmail = 'test2@test.ts';
    correctPassword = '12345678';
    userName = 'raccoon2';
    const mailManager = app.get<MailManager>(MailManager);

    const sendEmailConfirmationMessage = jest.spyOn(mailManager, 'sendUserConfirmation');
    const command = { password: correctPassword, email: correctEmail, userName };
    await authHelper.registrationUser(command);
    const oldConfirmationCode = sendEmailConfirmationMessage.mock.lastCall[1];
    await authHelper.registrationEmailResending({ email: correctEmail });
    confirmationCode = sendEmailConfirmationMessage.mock.lastCall[1];
    expect(oldConfirmationCode).not.toBe(confirmationCode);
  });
  // Registration confirmation
  it('46 - / (POST) - should confirm email after resending confirmationCode', async () => {
    const command = { confirmationCode: confirmationCode };
    await authHelper.registrationConfirmation(command);
  });
  it('47 - / (POST) - should register user and resend email 2 times', async () => {
    correctEmail = 'test3@test.ts';
    correctPassword = '12345678';
    userName = 'raccoon3';
    const mailManager = app.get<MailManager>(MailManager);

    const sendEmailConfirmationMessage = jest.spyOn(mailManager, 'sendUserConfirmation');
    const command = { password: correctPassword, email: correctEmail, userName };
    await authHelper.registrationUser(command);
    const oldConfirmationCode = sendEmailConfirmationMessage.mock.lastCall[1];

    await authHelper.registrationEmailResending({ email: correctEmail });
    const confirmationCode1 = sendEmailConfirmationMessage.mock.lastCall[1];
    expect(confirmationCode1).not.toBe(oldConfirmationCode);

    await authHelper.registrationEmailResending({ email: correctEmail });
    const confirmationCode2 = sendEmailConfirmationMessage.mock.lastCall[1];
    expect(confirmationCode2).not.toBe(confirmationCode1);
  });
});
describe('Recaptcha -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  // let mailManager: MailManager;

  beforeAll(async () => {
    app = await getAppForE2ETesting({ recaptchaOn: true });
    authHelper = new AuthHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  //auth/password-recovery with recaptcha
  it('01 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { email: 'validva@lidamail.tr', recaptcha: '12345678' };
    const response: ApiErrorResultDto = await authHelper.passwordRecovery(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('recaptcha');
  });
});
