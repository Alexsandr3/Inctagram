import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import { endpoints } from '../../src/modules/auth/api/auth.routing';

export class AuthHelper {
  constructor(private readonly app: INestApplication) {}

  async registration() {
    const result = await request(this.app.getHttpServer())
      .post(endpoints.registration())
      .send({})
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async registrationConfirmation() {
    const result = await request(this.app.getHttpServer())
      .post(endpoints.registrationConfirmation())
      .send({})
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async login() {
    const result = await request(this.app.getHttpServer()).post(endpoints.login()).send({}).expect(HTTP_Status.OK_200);
    return result.body;
  }

  async registrationEmailResending() {
    const result = await request(this.app.getHttpServer())
      .post(endpoints.registrationEmailResending())
      .send({})
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async passwordRecovery() {
    const result = await request(this.app.getHttpServer())
      .post(endpoints.passwordRecovery())
      .send({})
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async passwordRecoveryEmailResending() {
    const result = await request(this.app.getHttpServer())
      .post(endpoints.passwordRecoveryEmailResending())
      .send({})
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async newPassword() {
    const result = await request(this.app.getHttpServer())
      .post(endpoints.newPassword())
      .send({})
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async logout() {
    const result = await request(this.app.getHttpServer()).post(endpoints.logout()).send({}).expect(HTTP_Status.OK_200);
    return result.body;
  }
}
