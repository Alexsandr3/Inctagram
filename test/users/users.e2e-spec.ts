import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { UsersHelper } from '../helpers/users-helper';

describe('Users e2e', () => {
  let app: INestApplication;
  let usersHelper: UsersHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting(false);
    usersHelper = new UsersHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should find users', async () => {
    const result: { route: string; status: string } = await usersHelper.findUsers();
    expect(result.status).toBe('OK');
  });
  it('should create user', async () => {
    const result: { route: string; status: string } = await usersHelper.createUser();
    expect(result.status).toBe('OK');
  });
  it('should delete user', async () => {
    const result: { route: string; status: string } = await usersHelper.deleteUser('userId');
    expect(result.status).toBe('OK');
  });
});
