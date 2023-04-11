import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { usersEndpoints } from '../../src/modules/users/api/users.routing';
import fs from 'fs';

export class UsersHelper {
  constructor(private readonly app: INestApplication) {}

  async createProfile(
    command: any, //CreateProfileInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 201 or code mistake from config
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post(usersEndpoints.createProfile())
      .auth(config.expectedBody, { type: 'bearer' })
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async updateProfile(
    command: any, //CreateProfileInputDto,
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
      expectedBody?: any;
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
      .auth(config.expectedBody, { type: 'bearer' })
      .set('content-type', 'multipart/form-data')
      .attach('file', file, nameFile)
      .expect(expectedCode);

    return response.body;
  }
}
