import { INestApplication } from '@nestjs/common';
import { RegisterInputDto } from '../../src/modules/auth/api/input-dto/register.input.dto';
import request from 'supertest';
import { authEndpoints } from '../../src/modules/auth/api/routing/auth.routing';
import { RegistrationEmailResendingInputDto } from '../../src/modules/auth/api/input-dto/registration-email-resending.input.dto';
import { ConfirmationCodeInputDto } from '../../src/modules/auth/api/input-dto/confirmation-code.input.dto';
import { LoginInputDto } from '../../src/modules/auth/api/input-dto/login.input.dto';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import { PasswordRecoveryInputDto } from '../../src/modules/auth/api/input-dto/password-recovery.input.dto';
import { PasswordRecoveryCodeInputDto } from '../../src/modules/auth/api/input-dto/password-recovery-code.input.dto';
import { NewPasswordInputDto } from '../../src/modules/auth/api/input-dto/new-password.input.dto';
import { MailManager } from '../../src/providers/mailer/application/mail-manager.service';
import { EmailAdapter } from '../../src/providers/mailer/email.adapter';
import { MeViewDto } from '../../src/modules/auth/api/view-dto/me.view.dto';
import { googleEndpoints } from '../../src/modules/auth/api/routing/google.routing';
import { githubEndpoints } from '../../src/modules/auth/api/routing/github.routing';

export class AuthHelper {
  constructor(private readonly app: INestApplication) {}

  async registrationUser(
    command: RegisterInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.registration())
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async googleRegistration(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = { expectedCode: HTTP_Status.NO_CONTENT_204 },
  ): Promise<any> {
    // default expected code is 204 or code mistake from config
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .get(googleEndpoints.googleRegistrationHandler())
      .expect(config.expectedCode);

    return response.body;
  }

  async googleAuthorization(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = { expectedCode: HTTP_Status.OK_200 },
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    // send request for authorize user
    return request(this.app.getHttpServer())
      .get(googleEndpoints.googleAuthorizationHandler())
      .expect(config.expectedCode);
  }

  async gitHubRegistration(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = { expectedCode: HTTP_Status.NO_CONTENT_204 },
  ): Promise<any> {
    // default expected code is 204 or code mistake from config
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .get(githubEndpoints.githubRegistrationHandler())
      .expect(config.expectedCode);

    return response.body;
  }

  async githubAuthorization(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = { expectedCode: HTTP_Status.OK_200 },
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    // send request for authorize user
    return request(this.app.getHttpServer())
      .get(githubEndpoints.githubAuthorizationHandler())
      .expect(config.expectedCode);
  }

  async registrationConfirmation(
    command: ConfirmationCodeInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.registrationConfirmation())
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async confirmAddingExternalAccount(
    command: ConfirmationCodeInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = { expectedCode: HTTP_Status.NO_CONTENT_204 },
  ): Promise<any> {
    // default expected code is 204 or code mistake from config

    // confirm adding ExternalAccount
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.confirmAddingExternalAccount())
      .send(command)
      .expect(config.expectedCode);

    return response.body;
  }

  async rejectAddingExternalAccount(
    command: ConfirmationCodeInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = { expectedCode: HTTP_Status.NO_CONTENT_204 },
  ): Promise<any> {
    // default expected code is 204 or code mistake from config

    // reject adding ExternalAccount
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.rejectAddingExternalAccount())
      .send(command)
      .expect(config.expectedCode);

    return response.body;
  }

  async registrationEmailResending(
    command: RegistrationEmailResendingInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.registrationEmailResending())
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async login(
    command: LoginInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.login())
      .set(`User-Agent`, `for test`)
      .send(command)
      .expect(expectedCode);
    if (expectedCode === HTTP_Status.OK_200) {
      return response;
    }
    return response.body;
  }

  async passwordRecovery(
    command: PasswordRecoveryInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.passwordRecovery())
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async checkPasswordRecovery(
    command: PasswordRecoveryCodeInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.checkRecoveryCode())
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async newPassword(
    command: NewPasswordInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.newPassword())
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async logout(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.logout())
      .set('Cookie', `refreshToken=${config.expectedBody}`)
      .expect(expectedCode);

    return response.body;
  }

  async refreshToken(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.updateTokens())
      .set('Cookie', `refreshToken=${config.expectedBody}`)
      .expect(expectedCode);

    if (expectedCode === HTTP_Status.OK_200) {
      return response;
    }
    return response.body;
  }

  async createUser(
    command: RegisterInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    const mailManager = this.app.get<MailManager>(MailManager);
    const emailAdapter = this.app.get<EmailAdapter>(EmailAdapter);
    //mock sendEmail
    jest.spyOn(emailAdapter, 'sendEmail');
    const sendEmailConfirmationMessage = jest.spyOn(mailManager, 'sendUserConfirmation');
    //registration user
    await this.registrationUser(command, { expectedCode: 204 });
    //check sendEmailConfirmationMessage
    let confirmationCode: string;
    confirmationCode = sendEmailConfirmationMessage.mock.lastCall[1];
    expect(emailAdapter.sendEmail).toBeCalled();
    //confirm registration user
    const command2 = { confirmationCode: confirmationCode };
    await this.registrationConfirmation(command2, { expectedCode: 204 });
    //Login correct data
    let refreshToken: string;
    const command3 = { password: command.password, email: command.email };
    const response = await this.login(command3, { expectedCode: 200 });
    refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toContain('Path=/');
    expect(response.headers['set-cookie'][0]).toContain('Secure');
    return response.body.accessToken;
  }

  async me(accessToken: string, statusCode: HTTP_Status = HTTP_Status.OK_200): Promise<MeViewDto> {
    const response = await request(this.app.getHttpServer())
      .get(authEndpoints.me())
      .auth(accessToken, { type: 'bearer' })
      .expect(statusCode);

    return response.body;
  }
}
