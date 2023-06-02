import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { usersEndpoints } from '../../src/modules/users/api/routing/users.routing';
import fs from 'fs';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';

export class UsersHelper {
  constructor(private readonly app: INestApplication) {}

  async updateProfile(
    command: any, //UpdateProfileInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .put(usersEndpoints.updateProfile())
      .auth(config.expectedBody, { type: 'bearer' })
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async uploadPhotoAvatar(
    nameFile: string,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 201 or code mistake from config
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;
    // create file
    const file = fs.createReadStream(__dirname + '/../' + nameFile);
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post(usersEndpoints.uploadPhotoAvatar())
      .auth(config.token, { type: 'bearer' })
      .set('content-type', 'multipart/form-data')
      .attach('file', file, nameFile)
      .expect(expectedCode);

    return response.body;
  }

  async getMyProfile<T>(
    accessToken: string,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    const response = await request(this.app.getHttpServer())
      .get(usersEndpoints.getMyProfile())
      .auth(accessToken, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }

  async deletePhotosAvatar(
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .delete(usersEndpoints.deletePhotosAvatar())
      .auth(config.token, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }
}
