import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { UsersHelper } from '../helpers/users-helper';
import { ApiErrorResultDto } from '../../src/main/validators/api-error-result.dto';
import { ProfileViewDto } from '../../src/modules/users/api/view-models/profile-view.dto';
import { ProfileAvatarViewModel } from '../../src/modules/users/api/view-models/user-images-view.dto';
import { HTTP_Status } from '../../src/main/enums/http-status.enum';

jest.setTimeout(120000);
describe('Update-profile -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let usersHelper: UsersHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting(false);
    authHelper = new AuthHelper(app);
    usersHelper = new UsersHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // Registration correct data
  let accessToken: string;
  let accessToken2: string;
  let correctEmail_first_user = 'Kiarra92@yahoo.om';
  let correctUserName_first_user = 'Anderson';
  let firstUserProfile: ProfileViewDto;
  let correctEmail_second_user = 'Garnet4@yahoo.cm';
  let correctUserName_second_user = 'Addison';
  let userId: number;
  //       email: 'Serenity_Fahey@hotmail.com',
  //registration user
  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user, userName: correctUserName_first_user };
    const command2 = { password: '12345678', email: correctEmail_second_user, userName: correctUserName_second_user };
    accessToken = await authHelper.createUser(command, { expectedCode: 204 });
    accessToken2 = await authHelper.createUser(command2, { expectedCode: 204 });
  });
  it('01.1 - / (GET) - should return 200 and info about logged user', async () => {
    const myInfo = await authHelper.me(accessToken);
    userId = myInfo.userId;
  });
  it('01.2 - / (GET) - should return 200 and profile of user', async () => {
    const profile: ProfileViewDto = await usersHelper.getMyProfile(accessToken);
    expect(profile).toEqual({
      id: userId,
      userName: correctUserName_first_user,
      firstName: null,
      lastName: null,
      city: null,
      dateOfBirth: null,
      aboutMe: null,
      images: [],
    });
  });

  //Incorrect data
  it('02 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { userName: 'Cat' };
    const responseBody: ApiErrorResultDto = await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('userName');
  });
  it('03 - / (POST) - should return 400 if userName is empty', async () => {
    const command = { userName: '' };
    const responseBody: ApiErrorResultDto = await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('userName');
  });
  it('04 - / (POST) - should return 400 if userName is too long or too short', async () => {
    const command = { userName: 'C'.repeat(31) };
    const responseBody: ApiErrorResultDto = await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('userName');
  });
  it('05 - / (POST) - should return 400 if aboutMe is too long or is empty', async () => {
    let command = {
      userName: 'SuperPinkUser',
      firstName: 'Kowalski',
      lastName: 'James',
      city: 'New York',
      dateOfBirth: '10.23.2024',
      aboutMe: 'e'.repeat(201),
    };
    const responseBody: ApiErrorResultDto = await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('aboutMe');
    command.aboutMe = '';
    const responseBody2: ApiErrorResultDto = await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody2.messages[0].field).toBe('aboutMe');
  });
  it('06 - / (POST) - should return 400 if dateOfBirth is incorrect', async () => {
    const command = {
      userName: 'SuperPinkUser',
      dateOfBirth: 'new Date(1980, 10, 23)',
      aboutMe: 'e'.repeat(200),
    };
    const responseBody: ApiErrorResultDto = await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('dateOfBirth');
  });

  //Correct data
  it('20 - / (POST) - should return updated profile with code - 204 if all data is correct', async () => {
    const command = {
      userName: correctUserName_first_user,
      firstName: 'Kowalski',
      lastName: 'James',
      city: 'New York',
      dateOfBirth: '2024-10-23T00:00:00.000Z',
      aboutMe: 'e'.repeat(200),
    };
    await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: HTTP_Status.NO_CONTENT_204,
    });
    firstUserProfile = await usersHelper.getMyProfile(accessToken);

    expect(firstUserProfile).toEqual({
      ...command,
      id: userId,
      dateOfBirth: new Date(command.dateOfBirth).toISOString(),
      images: [],
    });
  });
  it('21 - / (POST) - should return 204 and delete set null in delete property', async () => {
    const command = {
      aboutMe: null,
    };

    await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: HTTP_Status.NO_CONTENT_204,
    });
    const changedProfile = await usersHelper.getMyProfile(accessToken);

    expect(changedProfile).toEqual({
      ...firstUserProfile,
      aboutMe: null,
    });
  });
  it('22 - / (POST) - should return 400 if userName is not unique', async () => {
    const command = {
      userName: correctUserName_second_user,
    };
    const responseBody: ApiErrorResultDto = await usersHelper.updateProfile(command, {
      expectedBody: accessToken,
      expectedCode: HTTP_Status.BAD_REQUEST_400,
    });
    expect(responseBody.messages[0].field).toBe('userName');
  });
  let command = {
    userName: correctUserName_second_user,
    firstName: 'Eda',
    lastName: 'Ratke',
    city: 'Leesburg',
    dateOfBirth: new Date('2024-10-23T00:00:00.000Z'),
    aboutMe:
      'Esse quasi laboriosam dolores minima quidem dolore. Officiis possimus dignissimos iusto ullam dignissimos ' +
      'laborum. At et consequatur. Earum quod repellat.',
  };
  it('23 - / (POST) - should return 204 if all data is correct', async () => {
    await usersHelper.updateProfile(command, {
      expectedBody: accessToken2,
      expectedCode: HTTP_Status.NO_CONTENT_204,
    });

    const myInfo = await authHelper.me(accessToken2);
    userId = myInfo.userId;
    const profile = await usersHelper.getMyProfile(accessToken2);

    expect(profile).toEqual({
      ...command,
      id: userId,
      dateOfBirth: new Date(command.dateOfBirth).toISOString(),
      images: [],
    });
  });
  it('24 - / (PUT) - should return 204 if all data is correct', async () => {
    command.userName = 'NightKing';
    command.firstName = 'Nick';
    command.lastName = ' ';
    command.city = 'Los Angeles';
    command.aboutMe = 'e'.repeat(200);
    const responseBody = await usersHelper.updateProfile(command, { expectedBody: accessToken2, expectedCode: 204 });
    expect(responseBody).toEqual({});
  });
  it('25 - / (GET) - should return 200 if all data is correct', async () => {
    const responseBody: ProfileViewDto = await usersHelper.getProfile(userId, {
      expectedBody: accessToken2,
      expectedCode: 200,
    });
    expect(responseBody).toEqual({
      ...command,
      lastName: 'Ratke',
      id: expect.any(Number),
      dateOfBirth: new Date(command.dateOfBirth).toISOString(),
      images: [],
    });
  });
  //Upload image profile
  it.skip('29 - / (POST) - should return 400 if data image incorrect', async () => {
    let nameFile = '/images/1271х847_357kb.jpeg';
    const responseBody: ApiErrorResultDto = await usersHelper.uploadPhotoAvatar(nameFile, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('file');
  });
  it('30 - / (POST) - should return 400 if data image incorrect', async () => {
    let nameFile = '/images/email.html';
    const responseBody: ApiErrorResultDto = await usersHelper.uploadPhotoAvatar(nameFile, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('file');
  });
  it('31 - / (POST) - should return 400 if data image incorrect', async () => {
    let nameFile = '/images/img-1028x312.txt';
    const responseBody: ApiErrorResultDto = await usersHelper.uploadPhotoAvatar(nameFile, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('file');
  });
  it.skip('32 - / (POST) - should return 400 if data image incorrect', async () => {
    let nameFile = '/images/667x1000_345kb.jpeg';
    const responseBody: ApiErrorResultDto = await usersHelper.uploadPhotoAvatar(nameFile, {
      expectedBody: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('file');
  });
  it.skip('33 - / (POST) - should return 201 if all data is correct for upload image', async () => {
    let nameFile = '/images/1000x667_304kb.jpeg';
    const responseBody: ProfileAvatarViewModel = await usersHelper.uploadPhotoAvatar(nameFile, {
      expectedBody: accessToken,
      expectedCode: 201,
    });
    expect(responseBody).toEqual({
      avatar: [
        {
          url: expect.any(String),
          width: expect.any(Number),
          height: expect.any(Number),
          fileSize: expect.any(Number),
        },
        {
          url: expect.any(String),
          width: expect.any(Number),
          height: expect.any(Number),
          fileSize: expect.any(Number),
        },
      ],
    });
  });
  it.skip('34 - / (GET) - should return 200 and profile of user', async () => {
    const profile: ProfileViewDto = await usersHelper.getMyProfile(accessToken);
    expect(profile).toEqual({ ...firstUserProfile, images: expect.any(Array) });
    expect(profile.images.length).toBe(2);
    expect(profile.images).toEqual(
      expect.arrayContaining([
        {
          createdAt: expect.any(String),
          fileSize: expect.any(Number),
          height: expect.any(Number),
          id: expect.any(Number),
          imageType: expect.any(String),
          profileId: expect.any(Number),
          sizeType: expect.any(String),
          updatedAt: expect.any(String),
          url: expect.any(String),
          width: expect.any(Number),
        },
      ]),
    );
  });

  it.skip('35 - / (POST) - should return 201 if all data is correct', async () => {
    let nameFile = '/images/859x720_338kb.jpeg';
    const responseBody: ProfileAvatarViewModel = await usersHelper.uploadPhotoAvatar(nameFile, {
      expectedBody: accessToken2,
      expectedCode: 201,
    });
    expect(responseBody).toEqual({
      avatar: [
        {
          url: expect.any(String),
          width: expect.any(Number),
          height: expect.any(Number),
          fileSize: expect.any(Number),
        },
        {
          url: expect.any(String),
          width: expect.any(Number),
          height: expect.any(Number),
          fileSize: expect.any(Number),
        },
      ],
    });
  });
});
