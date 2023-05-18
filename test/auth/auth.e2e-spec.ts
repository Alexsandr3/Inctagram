import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { AuthHelper } from '../helpers/auth-helper';
import { ApiErrorResultDto } from '../../src/main/validators/api-error-result.dto';
import { MailManager } from '../../src/providers/mailer/application/mail-manager.service';
import { EmailAdapter } from '../../src/providers/mailer/email.adapter';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import { GoogleRegistrationGuard } from '../../src/modules/auth/api/guards/google-registration.guard';
import { RegisterUserFromExternalAccountInputDto } from '../../src/modules/auth/api/input-dto/register-user-from-external-account-input.dto';
import { Provider } from '../../src/modules/users/domain/ExternalAccountEntity';
import { GoogleAuthorizationGuard } from '../../src/modules/auth/api/guards/google-authorization.guard';
import { IUsersRepository } from '../../src/modules/users/infrastructure/users.repository';
import { GitHubRegistrationGuard } from '../../src/modules/auth/api/guards/github-registration.guard';
import { GitHubAuthorizationGuard } from '../../src/modules/auth/api/guards/github-authorization.guard';
import { ApiConfigService } from '../../src/modules/api-config/api.config.service';

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
  it('03_4 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { password: 'qwerty', email: 'fortesting@jive.com', userName: 'D name'.repeat(31) };
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
    refreshToken = await authHelper.checkRefreshTokenInCookieAndReturn(response);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body).toEqual({ accessToken: expect.any(String) });
    accessToken = response.body.accessToken;
  });

  //Get myInfo
  it('32.1 - / (GET) - should return 200 and info about logged user', async () => {
    const myInfo = await authHelper.me(accessToken);
    expect(myInfo).toEqual({ userId: expect.any(Number), userName, email: correctEmail, hasBusinessAccount: false });
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
    freshRefreshToken = await authHelper.checkRefreshTokenInCookieAndReturn(response);

    expect(response.body.accessToken).toBeDefined();
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

  //Update refresh token
  it('43 - / (POST) - should return 200 if refreshToken correct', async () => {
    const response = await authHelper.refreshToken({ expectedCode: 200, expectedBody: freshRefreshToken });
    expect(response.body.accessToken).toBeDefined();
    await authHelper.checkRefreshTokenInCookieAndReturn(response);
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

  describe('Recaptcha -  e2e', () => {
    let app: INestApplication;
    let authHelper: AuthHelper;
    // let mailManager: MailManager;

    beforeAll(async () => {
      app = await getAppForE2ETesting({ useRecaptcha: true });
      authHelper = new AuthHelper(app);
    });

    afterAll(async () => {
      await app.close();
    });

    //auth/password-recovery with recaptcha
    it.skip('01 - / (POST) - should return 400 if email is incorrect', async () => {
      const command = { email: 'validva@lidamail.tr', recaptcha: '12345678' };
      const response: ApiErrorResultDto = await authHelper.passwordRecovery(command, { expectedCode: 400 });
      expect(response.messages).toHaveLength(1);
      expect(response.messages[0].field).toBe('recaptcha');
    });
  });
});

describe('OAuth2 -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let userId: number;
  let refreshToken: string;
  let accessToken: string;
  let confirmationCode: string;

  const googleDto: RegisterUserFromExternalAccountInputDto = {
    displayName: 'Cho-o-nya',
    email: 'test@test.goo',
    provider: Provider.GOOGLE,
    providerId: '12345',
  };
  const gitHubDto: RegisterUserFromExternalAccountInputDto = {
    displayName: 'Hru-nya',
    email: 'test@test.git',
    provider: Provider.GITHUB,
    providerId: 'gh12345',
  };
  let googleRegistrationGuard: GoogleRegistrationGuard;
  let gitHubRegistrationGuard: GitHubRegistrationGuard;
  let prismaUsersRepository: IUsersRepository;
  let mailManager: MailManager;
  let emailAdapter: EmailAdapter;
  let apiConfigService: ApiConfigService;

  beforeAll(async () => {
    app = await getAppForE2ETesting({ useRecaptcha: true });
    authHelper = new AuthHelper(app);
    apiConfigService = app.get<ApiConfigService>(ApiConfigService);
    googleRegistrationGuard = app.get<GoogleRegistrationGuard>(GoogleRegistrationGuard);
    gitHubRegistrationGuard = app.get<GitHubRegistrationGuard>(GitHubRegistrationGuard);
    prismaUsersRepository = app.get<IUsersRepository>(IUsersRepository);
    mailManager = app.get<MailManager>(MailManager);
    emailAdapter = app.get<EmailAdapter>(EmailAdapter);
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * @description mock GoogleRegistrationGuard
   * @param dto payLoad value
   */
  const mockGuardForGoogleRegistration = (dto: any) => {
    jest.spyOn(googleRegistrationGuard, 'canActivate').mockImplementation(args => {
      const req = args.switchToHttp().getRequest();
      req.payLoad = dto;
      return true;
    });
  };
  const mockGuardForGitHubRegistration = (dto: any) => {
    jest.spyOn(gitHubRegistrationGuard, 'canActivate').mockImplementation(args => {
      const req = args.switchToHttp().getRequest();
      req.payLoad = dto;
      return true;
    });
  };

  //auth/password-recovery with recaptcha

  // Registration by Google account
  it('50.1 - / (GET) - should return 204 in header["location"], register and authorize user by Google account', async () => {
    mockGuardForGoogleRegistration(googleDto);
    jest.spyOn(emailAdapter, 'sendEmail');

    const response = await authHelper.googleRegistration();
    expect(response.headers['location']).toBe(`${apiConfigService.CLIENT_URL}/auth/login?status_code=204`);
    refreshToken = await authHelper.checkRefreshTokenInCookieAndReturn(response);

    const user = await prismaUsersRepository.findUserByEmail(googleDto.email);
    userId = user.id;

    expect(user.userName).toBe(googleDto.displayName);
    expect(user.email).toBe(googleDto.email);
    expect(user.isConfirmed).toBe(true);
    expect(user.externalAccounts.length).toBe(1);
    expect(user.externalAccounts[0].provider).toBe(googleDto.provider);
    expect(user.externalAccounts[0].providerId).toBe(googleDto.providerId);
    expect(emailAdapter.sendEmail).toBeCalled();
  });
  it('50.2 - / (POST, GET) - should update tokens and then get "me"', async () => {
    const response = await authHelper.refreshToken({ expectedBody: refreshToken });

    accessToken = response.body.accessToken;
    expect(accessToken).toBeDefined();
    await authHelper.checkRefreshTokenInCookieAndReturn(response);

    const myInfo = await authHelper.me(accessToken);
    expect(myInfo).toEqual({
      userId: expect.any(Number),
      userName: googleDto.displayName,
      email: googleDto.email,
      hasBusinessAccount: false,
    });
  });
  it('51 - / (GET) - should return 302 and register user by Google account with correcting the name', async () => {
    const dto2: RegisterUserFromExternalAccountInputDto = {
      displayName: 'Cho',
      email: 'test2@test.goo',
      provider: Provider.GOOGLE,
      providerId: '12345_2',
    };
    mockGuardForGoogleRegistration(dto2);

    await authHelper.googleRegistration();
    const user2 = await prismaUsersRepository.findUserByEmail(dto2.email);
    expect(user2.userName).toBe(dto2.displayName + '_00');
    expect(user2.email).toBe(dto2.email);
    expect(user2.isConfirmed).toBe(true);
    expect(user2.externalAccounts.length).toBe(1);
    expect(user2.externalAccounts[0].provider).toBe(dto2.provider);
    expect(user2.externalAccounts[0].providerId).toBe(dto2.providerId);

    //new test
    const dto3: RegisterUserFromExternalAccountInputDto = {
      displayName: user2.userName,
      email: 'test3@test.goo',
      provider: Provider.GOOGLE,
      providerId: '12345_3',
    };
    mockGuardForGoogleRegistration(dto3);

    await authHelper.googleRegistration();
    const user3 = await prismaUsersRepository.findUserByEmail(dto3.email);
    expect(user3.userName).toBe(dto2.displayName + '_10');

    //new test
    const dto4: RegisterUserFromExternalAccountInputDto = {
      displayName: 'very_very_very_very_big_userName',
      email: 'test4@test.goo',
      provider: Provider.GOOGLE,
      providerId: '12345_4',
    };
    mockGuardForGoogleRegistration(dto4);

    await authHelper.googleRegistration();
    const user4 = await prismaUsersRepository.findUserByEmail(dto4.email);
    expect(user4.userName).toBe('user_4');

    //new test
    const dto5: RegisterUserFromExternalAccountInputDto = {
      displayName: 'user_name',
      email: 'test5@test.goo',
      provider: Provider.GOOGLE,
      providerId: '12345_5',
    };
    mockGuardForGoogleRegistration(dto5);

    await authHelper.googleRegistration();
    const user5 = await prismaUsersRepository.findUserByEmail(dto5.email);
    expect(user5.userName).toBe(dto5.displayName);

    //new test
    const dto6: RegisterUserFromExternalAccountInputDto = {
      displayName: dto5.displayName,
      email: 'test6@test.goo',
      provider: Provider.GOOGLE,
      providerId: '12345_6',
    };
    mockGuardForGoogleRegistration(dto6);

    await authHelper.googleRegistration();
    const user6 = await prismaUsersRepository.findUserByEmail(dto6.email);
    expect(user6.userName).toBe(dto6.displayName + '_0');
  });
  it('52 - / (GET) - should return 400 in header["location"] if user is already registered', async () => {
    mockGuardForGoogleRegistration(googleDto);

    const response = await authHelper.googleRegistration();
    expect(response.headers['location']).toContain(`${apiConfigService.CLIENT_URL}/auth/registration?status_code=400`);
  });
  // Authorization by Google account
  it('53 - / (GET) - should return 204 and authorize user by Google account', async () => {
    const dto = {
      userId,
    };
    const googleAuthorizationGuard = app.get<GoogleAuthorizationGuard>(GoogleAuthorizationGuard);
    jest.spyOn(googleAuthorizationGuard, 'canActivate').mockImplementation(args => {
      const req = args.switchToHttp().getRequest();
      req.user = dto;
      return true;
    });

    const response = await authHelper.googleAuthorization();
    expect(response.headers['location']).toBe(`${apiConfigService.CLIENT_URL}/auth/login?status_code=200`);

    refreshToken = await authHelper.checkRefreshTokenInCookieAndReturn(response);
  });
  // Add Google account to existing user
  it('54 - / (GET) - should return 204 and add Google account to existing user', async () => {
    const dto: RegisterUserFromExternalAccountInputDto = {
      displayName: 'Cho-o-nya_Best',
      email: 'TEST@TESt.goo',
      provider: Provider.GOOGLE,
      providerId: '12345___1',
    };
    mockGuardForGoogleRegistration(dto);

    jest.spyOn(emailAdapter, 'sendEmail');
    const sendEmailConfirmationMessage = jest.spyOn(mailManager, 'sendUserConfirmationCodeForExternalAccount');

    await authHelper.googleRegistration();

    const user = await prismaUsersRepository.findUserByEmail(dto.email);

    authHelper.checkAddedExternalAccount(dto, user);

    confirmationCode = sendEmailConfirmationMessage.mock.lastCall[1];
    expect(emailAdapter.sendEmail).toBeCalled();
  });
  // Registration by GitHub account
  it('55 - / (GET) - should return 204 and register user by GitHub account', async () => {
    mockGuardForGitHubRegistration(gitHubDto);

    const response = await authHelper.gitHubRegistration();
    expect(response.headers['location']).toBe(`${apiConfigService.CLIENT_URL}/auth/login?status_code=204`);
    await authHelper.checkRefreshTokenInCookieAndReturn(response);

    const user = await prismaUsersRepository.findUserByEmail(gitHubDto.email);
    userId = user.id;

    expect(user.userName).toBe(gitHubDto.displayName);
    expect(user.email).toBe(gitHubDto.email);
    expect(user.isConfirmed).toBe(true);
    expect(user.externalAccounts.length).toBe(1);
    expect(user.externalAccounts[0].provider).toBe(gitHubDto.provider);
    expect(user.externalAccounts[0].providerId).toBe(gitHubDto.providerId);
    expect(emailAdapter.sendEmail).toBeCalled();
  });
  // Authorization by GitHub account
  it('56 - / (GET) - should return 204 and authorize user by GitHub account', async () => {
    const dto = {
      userId,
    };
    const gitHubAuthorizationGuard = app.get<GitHubAuthorizationGuard>(GitHubAuthorizationGuard);
    jest.spyOn(gitHubAuthorizationGuard, 'canActivate').mockImplementation(args => {
      const req = args.switchToHttp().getRequest();
      req.user = dto;
      return true;
    });

    const response = await authHelper.githubAuthorization();
    expect(response.headers['location']).toBe(`${apiConfigService.CLIENT_URL}/auth/login?status_code=200`);

    refreshToken = await authHelper.checkRefreshTokenInCookieAndReturn(response);
  });
  // Add GitHub account to existing user
  it('57 - / (GET) - should return 204 and add GitHub account to existing user', async () => {
    const dto: RegisterUserFromExternalAccountInputDto = {
      displayName: 'Hru-nya_Best',
      email: 'TEST@TESt.git',
      provider: Provider.GITHUB,
      providerId: 'gh12345___1',
    };
    mockGuardForGitHubRegistration(dto);

    await authHelper.gitHubRegistration();

    const user = await prismaUsersRepository.findUserByEmail(dto.email);

    authHelper.checkAddedExternalAccount(dto, user);
  });
  // Confirm adding external account to user
  it('60 - / (POST) - should return 204 if confirmationCode is correct and authorize user', async () => {
    const command = { confirmationCode: confirmationCode };
    const response = await authHelper.confirmAddingExternalAccount(command);

    refreshToken = await authHelper.checkRefreshTokenInCookieAndReturn(response);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body).toEqual({ accessToken: expect.any(String) });
    accessToken = response.body.accessToken;
  });
  it('61 - / (POST) - should return 400 if adding external account is already confirmed', async () => {
    const command = { confirmationCode: confirmationCode };
    await authHelper.confirmAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
  });
  it('62 - / (POST) - should return 400 if confirmationCode is incorrect', async () => {
    let command = { confirmationCode: 'confirmationCode' };
    await authHelper.confirmAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
    command = { confirmationCode: null };
    await authHelper.confirmAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
    command = null;
    await authHelper.confirmAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
    command = undefined;
    await authHelper.confirmAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
  });
  // Reject adding external account to user
  it('63 - / (POST) - should return 400 if try reject of adding external account which is already confirmed', async () => {
    const command = { confirmationCode: confirmationCode };
    await authHelper.rejectAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
  });
  it('64 - / (POST) - should return 204 if confirmationCode is correct (include: Add Google account to existing user)', async () => {
    const dto: RegisterUserFromExternalAccountInputDto = {
      displayName: 'Cho-o-nya_Best2',
      email: 'test@test.git',
      provider: Provider.GOOGLE,
      providerId: '12345___2',
    };
    mockGuardForGoogleRegistration(dto);
    const sendEmailConfirmationMessage = jest.spyOn(mailManager, 'sendUserConfirmationCodeForExternalAccount');

    await authHelper.googleRegistration();
    const user = await prismaUsersRepository.findUserByEmail(dto.email);
    expect(user.externalAccounts.length).toBe(3);
    const addedExternalAccount = user.externalAccounts.find(a => a.providerId === dto.providerId);
    expect(addedExternalAccount.isConfirmed).toBe(false);
    confirmationCode = sendEmailConfirmationMessage.mock.lastCall[1];

    const command = { confirmationCode: confirmationCode };
    await authHelper.rejectAddingExternalAccount(command);
  });
  it('65 - / (POST) - should return 400 if confirmationCode is incorrect', async () => {
    let command = { confirmationCode: 'confirmationCode' };
    await authHelper.rejectAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
    command = { confirmationCode: null };
    await authHelper.rejectAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
    command = null;
    await authHelper.rejectAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
    command = undefined;
    await authHelper.rejectAddingExternalAccount(command, { expectedCode: HTTP_Status.BAD_REQUEST_400 });
  });
});
