import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DocumentNode } from 'graphql/language';

// import request from 'supertest-graphql';

export class SuperAdminHelper {
  constructor(private readonly app: INestApplication) {}

  async getUsers<T>(
    command: DocumentNode,
    config: {
      expectedBody?: any;
    } = {},
  ): Promise<any> {
    // send request for create user
    const response = await request(this.app.getHttpServer()).post('/graphql').send({ query: command.loc?.source.body });
    return response.body.data;
  }

  async deleteUser(
    command: string,
    config: {
      expectedBody?: any;
    } = {},
  ): Promise<any> {
    const response = await request(this.app.getHttpServer()).post('/graphql').send({ query: command });
    return response.body.data;
  }
}
