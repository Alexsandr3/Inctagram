import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import fs from 'fs';
import { postsEndpoints } from '../../src/modules/posts/api/routing/posts.routing';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import { PostViewModel } from '../../src/modules/posts/api/view-models/post-view.dto';
import { UpdatePostInputDto } from '../../src/modules/posts/api/input-dto/update-post.input.dto';
import { tempPostsEndpoints } from '../../src/modules/posts/temp/temp-posts.routing';

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
    uploadId: string,
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

  async updatePost<T = void>(
    postId: number,
    command: UpdatePostInputDto,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    const response = await request(this.app.getHttpServer())
      .put(postsEndpoints.updatePost(postId))
      .auth(config.token, { type: 'bearer' })
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async getPosts(
    userId: number,
    query?: any,
    config: {
      token?: any;
      expectedCode?: number;
    } = {},
  ) {
    // default expected code is 204 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.OK_200;
    const response = await request(this.app.getHttpServer())
      .get(postsEndpoints.getPosts(userId))
      .auth(config.token, { type: 'bearer' })
      // .query(query)
      .expect(expectedCode);

    return response.body;
  }

  async uploadImagesAndCreatePost<T = PostViewModel>(
    body: {
      description: string;
      nameFile: string[];
    },
    config: {
      token?: string;
      expectedCode?: number;
    } = {},
  ): Promise<T> {
    // default expected code is 201 or code mistake from config
    const expectedCode = config.expectedCode ?? HTTP_Status.CREATED_201;
    // create file
    const files = [];
    for (const file of body.nameFile) {
      files.push(fs.createReadStream(__dirname + '/../' + file));
    }
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post(tempPostsEndpoints.uploadImagePost())
      .auth(config.token, { type: 'bearer' })
      .field('description', body.description)
      .set('content-type', 'multipart/form-data')
      .attach('files', files[0], body.nameFile[0])
      .attach('files', files[1], body.nameFile[1])
      .attach('files', files[2], body.nameFile[2])
      .expect(expectedCode);

    return response.body;
  }

  async deleteImage(query: { uploadId: string; postId: number }, config: { expectedCode: number; token: string }) {
    const expectedCode = config.expectedCode ?? HTTP_Status.NO_CONTENT_204;
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .delete(tempPostsEndpoints.deleteImagePost(query.postId, query.uploadId))
      .auth(config.token, { type: 'bearer' })
      .expect(expectedCode);

    return response.body;
  }
}
