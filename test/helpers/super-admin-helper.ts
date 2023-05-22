import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DocumentNode } from 'graphql/language';

export class SuperAdminHelper {
  constructor(private readonly app: INestApplication) {}

  async getUsers<T>(command: DocumentNode): Promise<any> {
    // send request for create user
    const response = await request(this.app.getHttpServer())
      .post('/graphql')
      .auth(`admin@admin.me`, `admin`, { type: 'basic' })
      .send({ query: command.loc?.source.body });
    return response.body.data;
  }

  async deleteUser(command: string): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .post('/graphql')
      .auth(`admin@admin.me`, `admin`, { type: 'basic' })
      .send({ query: command });
    return response.body.data;
  }
}
