import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { SessionsHelper } from '../helpers/sessions-helper';
import { DevicesViewModel } from '../../src/modules/sessions/api/session.view.dto';

jest.setTimeout(120000);
describe('Sessions -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let sessionHelper: SessionsHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
    sessionHelper = new SessionsHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // Registration correct data
  let accessToken: string;
  let refreshToken: string;
  let correctEmail_first_user = 'Shreks@admin.com';
  let correctUserName_first_user = 'Shreks';
  let currentPassword = '12345678';
  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: currentPassword, email: correctEmail_first_user, userName: correctUserName_first_user };
    const body = await authHelper.createUser(command, { expectedCode: 204 }, true);
    accessToken = body.accessToken;
    refreshToken = body.refreshToken;
  });

  //Get user session correct data
  it('02 - / (GET) - should return 204 if user authorized with all sessions', async () => {
    const response = await sessionHelper.getUserSession<DevicesViewModel>({
      expectedCode: 200,
      expectedBody: refreshToken,
    });
    expect(response).toBeDefined();
    expect(response).toEqual({ devices: expect.any(Array), currentDeviceId: expect.any(Number) });
  });
  //Logout correct data
  it('03 - / (POST) - should return 204 if user authorized', async () => {
    await authHelper.logout({ expectedCode: 204, expectedBody: refreshToken });
  });
  //Get user session after logout
  it('04 - / (GET) - should return 401 if session not found', async () => {
    const response = await sessionHelper.getUserSession<DevicesViewModel>({
      expectedCode: 401,
      expectedBody: refreshToken,
    });
    expect(response).toBeDefined();
  });
  //Login with two devices
  let type = 'Mobile';
  let type2 = 'Desktop';
  let type3 = 'Tablet';
  let type4 = 'SuperDevice';
  let freshRefreshTokenForType: string;
  let freshRefreshTokenForType2: string;
  let freshRefreshTokenForType3: string;
  let freshRefreshTokenForType4: string;
  it('05 - / (POST) - should return 200 with new tokens if user authorized', async () => {
    const command = { password: currentPassword, email: correctEmail_first_user };
    const response = await authHelper.login(command, { expectedCode: 200 }, type);
    freshRefreshTokenForType = await authHelper.checkRefreshTokenInCookieAndReturn(response);
    expect(response.body.accessToken).toBeDefined();
  });
  it('06 - / (POST) - should return 200 with new tokens if user authorized', async () => {
    const command = { password: currentPassword, email: correctEmail_first_user };
    const response = await authHelper.login(command, { expectedCode: 200 }, type2);
    freshRefreshTokenForType2 = await authHelper.checkRefreshTokenInCookieAndReturn(response);
    expect(response.body.accessToken).toBeDefined();
  });
  it('06 - / (POST) - should return 200 with new tokens if user authorized', async () => {
    const command = { password: currentPassword, email: correctEmail_first_user };
    const response = await authHelper.login(command, { expectedCode: 200 }, type3);
    freshRefreshTokenForType3 = await authHelper.checkRefreshTokenInCookieAndReturn(response);
    expect(response.body.accessToken).toBeDefined();
  });
  it('07 - / (POST) - should return 200 with new tokens if user authorized', async () => {
    const command = { password: currentPassword, email: correctEmail_first_user };
    const response = await authHelper.login(command, { expectedCode: 200 }, type4);
    freshRefreshTokenForType4 = await authHelper.checkRefreshTokenInCookieAndReturn(response);
    expect(response.body.accessToken).toBeDefined();
  });

  let deviceId: number;
  let deviceId2: number;
  let deviceId3: number;
  let deviceId4: number;
  //Get user session after logout
  it('08 - / (GET) - should return 401 if session not found', async () => {
    const body = await sessionHelper.getUserSession<DevicesViewModel>({
      expectedCode: 200,
      expectedBody: freshRefreshTokenForType,
    });
    deviceId = body.devices[0].deviceId; //'Mobile' - ['freshRefreshTokenForType']
    deviceId2 = body.devices[1].deviceId; //'Desktop' - ['freshRefreshTokenForType2']
    deviceId3 = body.devices[2].deviceId; //'Tablet' - ['freshRefreshTokenForType3']
    deviceId4 = body.devices[3].deviceId; //'SuperDevice' - ['freshRefreshTokenForType4']
    expect(body).toBeDefined();
    expect(body.devices).toHaveLength(4);
    expect(body.devices[0].userAgent).toEqual(type);
    expect(body.devices[1].userAgent).toEqual(type2);
    expect(body.devices[2].userAgent).toEqual(type3);
    expect(body.devices[3].userAgent).toEqual(type4);
    expect(body.currentDeviceId).toEqual(body.devices[0].deviceId);
  });
  //delete selected session  it's 'SuperDevice'
  it('09 - / (DELETE) - should return 204 if session deleted', async () => {
    await sessionHelper.deleteSelectedSession({
      expectedCode: 204,
      expectedBody: freshRefreshTokenForType,
      deviceId: deviceId4,
    });
  });
  it('10 - / (GET) - should return 401 if session not found', async () => {
    const body = await sessionHelper.getUserSession<DevicesViewModel>({
      expectedCode: 401,
      expectedBody: freshRefreshTokenForType4,
    });
    expect(body).toBeDefined();
  });
  it('11 - / (GET) - should return 200 if session found', async () => {
    const body = await sessionHelper.getUserSession<DevicesViewModel>({
      expectedCode: 200,
      expectedBody: freshRefreshTokenForType3,
    });
    expect(body).toBeDefined();
    expect(body.devices).toHaveLength(3);
    expect(body.devices).not.toContainEqual(type4);
  });

  //Terminate all sessions except current
  it('12 - / (DELETE) - should return 204 if session deleted', async () => {
    await sessionHelper.terminateAllSessionsExceptCurrent({
      expectedCode: 204,
      expectedBody: freshRefreshTokenForType2,
    });
  });
  it('13 - / (GET) - should return 401 if session not found', async () => {
    const body = await sessionHelper.getUserSession<DevicesViewModel>({
      expectedCode: 401,
      expectedBody: freshRefreshTokenForType,
    });
    expect(body).toBeDefined();
  });
  it('14 - / (GET) - should return 200 if session found', async () => {
    const body = await sessionHelper.getUserSession<DevicesViewModel>({
      expectedCode: 200,
      expectedBody: freshRefreshTokenForType2,
    });
    expect(body).toBeDefined();
    expect(body.devices).toHaveLength(1);
    expect(body.devices[0].userAgent).toEqual(type2);
  });
});
