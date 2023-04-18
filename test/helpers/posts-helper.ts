import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import fs from 'fs';
import { postsEndpoints } from '../../src/modules/posts/api/posts.routing';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import { PostViewModel } from '../../src/modules/posts/api/view-models/post-view.dto';

export class PostsHelper {
  constructor(private readonly app: INestApplication) {}

  async createPost<T = PostViewModel>(
    command: any, //CreatePostInputDto,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 201 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.CREATED_201;
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
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
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
    const expectedCode = config.expectedCode ?? HTTP_Status.CREATED_201;
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

  async getPost<T = PostViewModel>(
    postId: number,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    const response = await request(this.app.getHttpServer())
      .get(postsEndpoints.getPost(postId))
      .auth(config.token, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }

  async deletePost<T = void>(
    postId: number,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    const response = await request(this.app.getHttpServer())
      .delete(postsEndpoints.deletePost(postId))
      .auth(config.token, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }
}
