import { HttpStatus, INestApplication } from '@nestjs/common';
import { RegisterInputDto } from '../../src/modules/auth/api/input-dto/register.input.dto';
import request from 'supertest';
import { authEndpoints } from '../../src/modules/auth/api/auth.routing';
import { RegistrationEmailResendingInputDto } from '../../src/modules/auth/api/input-dto/registration-email-resending.input.dto';
import { ConfirmationCodeInputDto } from '../../src/modules/auth/api/input-dto/confirmation-code.input.dto';
import { LoginInputDto } from '../../src/modules/auth/api/input-dto/login.input.dto';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import { PasswordRecoveryInputDto } from '../../src/modules/auth/api/input-dto/password-recovery.input.dto';
import { PasswordRecoveryCodeInputDto } from '../../src/modules/auth/api/input-dto/password-recovery-code.input.dto';
import { NewPasswordInputDto } from '../../src/modules/auth/api/input-dto/new-password.input.dto';

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
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.registration())
      .send(command)
      .expect(expectedCode);

    return response.body;
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

  async passwordRecoveryEmailResending(
    command: RegistrationEmailResendingInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.passwordRecoveryEmailResending())
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
}
