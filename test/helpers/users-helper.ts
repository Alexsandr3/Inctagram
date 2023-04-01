import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';
import { endpoints } from '../../src/modules/users/api/users.routing';

export class UsersHelper {
  constructor(private readonly app: INestApplication) {}

  async findUsers() {
    const result = await request(this.app.getHttpServer()).get(endpoints.findUsers()).expect(HTTP_Status.OK_200);
    return result.body;
  }

  async createUser() {
    const result = await request(this.app.getHttpServer())
      .post(endpoints.createUser())
      .send({})
      .expect(HTTP_Status.CREATED_201);
    return result.body;
  }

  async deleteUser(id: string) {
    const result = await request(this.app.getHttpServer()).delete(endpoints.deleteUser(id)).expect(HTTP_Status.OK_200);
    return result.body;
  }
}
