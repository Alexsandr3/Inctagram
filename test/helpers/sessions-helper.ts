import { INestApplication } from '@nestjs/common';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import request from 'supertest';
import { sessionsEndpoints } from '../../src/modules/sessions/api/routing/sessions.routing';

export class SessionsHelper {
  constructor(private readonly app: INestApplication) {}
  async getUserSession<T>(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .get(sessionsEndpoints.getUserSession())
      .set('Cookie', `refreshToken=${config.expectedBody}`)
      .expect(expectedCode);

    return response.body;
  }

  async terminateAllSessionsExceptCurrent(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .delete(sessionsEndpoints.terminateAllSessionsExceptCurrent())
      .set('Cookie', `refreshToken=${config.expectedBody}`)
      .expect(expectedCode);

    return response.body;
  }

  async deleteSelectedSession(
    config: {
      expectedBody?: any;
      expectedCode?: number;
      deviceId?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .delete(sessionsEndpoints.deleteSelectedSession(config.deviceId))
      .set('Cookie', `refreshToken=${config.expectedBody}`)
      .expect(expectedCode);

    return response.body;
  }
}
