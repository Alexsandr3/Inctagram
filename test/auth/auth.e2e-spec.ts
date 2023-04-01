import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { AuthHelper } from '../helpers/auth-helper';

describe('Clients-admin e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;

  beforeEach(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be', () => {
    expect(authHelper).toBeDefined();
  });
});
