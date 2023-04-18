import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import fs from 'fs';
import { postsEndpoints } from '../../src/modules/posts/api/posts.routing';

export class PostsHelper {
  constructor(private readonly app: INestApplication) {}

  async createPost(
    command: any, //CreatePostInputDto,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 201 or code mistake from config
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post(postsEndpoints.createPost())
      .auth(config.token, { type: 'bearer' })
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async deletePhotoPost(
    uploadId: number,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .delete(postsEndpoints.deleteImagePost(uploadId))
      .auth(config.token, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }

  async uploadPhotoPost(
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
      .post(postsEndpoints.uploadImagePost())
      .auth(config.token, { type: 'bearer' })
      .set('content-type', 'multipart/form-data')
      .attach('file', file, nameFile)
      .expect(expectedCode);

    return response.body;
  }
}
