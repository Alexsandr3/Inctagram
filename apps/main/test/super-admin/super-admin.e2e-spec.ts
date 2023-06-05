import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { UsersHelper } from '../helpers/users-helper';
import { AvatarsViewModel } from '../../src/modules/users/api/view-models/avatars-view.dto';
import { SuperAdminHelper } from '../helpers/super-admin-helper';
import { PaginationUsersInputDto } from '../../src/modules/super-admin/api/input-dto/pagination-users.input.args';
import { ProfileViewModel } from '../../src/modules/users/api/view-models/profile-view.dto';
import gql from 'graphql-tag';
import { ImageSizeConfig } from '../../../images-ms/src/modules/images/image-size-config.type';
import { PostViewModel } from '../../src/modules/posts/api/view-models/post-view.dto';
import { PostsHelper } from '../helpers/posts-helper';

jest.setTimeout(120000);
describe('Super-admin with GraphQL AppResolve -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let usersHelper: UsersHelper;
  let postsHelper: PostsHelper;
  let superAdminHelper: SuperAdminHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
    usersHelper = new UsersHelper(app);
    postsHelper = new PostsHelper(app);
    superAdminHelper = new SuperAdminHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // Create fake users for registration
  const commands = [
    { password: 'pass123', email: 'alexander123@gmail.com', userName: 'Alex_123' },
    { password: 'P@55w0rd', email: 'emma.brown456@hotmail.com', userName: 'EmmaB456' },
    { password: '987654321', email: 'liam.wilson@gmail.com', userName: 'LiamWilson21' },
    { password: 'qwertyuiop', email: 'sophia456@yahoo.com', userName: 'Soph123ia' },
    { password: 'abcd1234', email: 'noah.smith789@gmail.com', userName: 'Noah_Smith' },
    { password: 'hello123', email: 'olivia_12@yahoo.com', userName: 'Olivia_12' },
    { password: 'password123', email: 'michael.davis34@gmail.com', userName: 'Mike_789' },
    { password: 'pass1234', email: 'ava.anderson56@hotmail.com', userName: 'AvaAnders0n' },
    { password: 'letmein123', email: 'jacob.smithy@gmail.com', userName: 'Jacob_S123' },
    { password: 'iloveyou123', email: 'isabella123@yahoo.com', userName: 'Bella_456' },
    { password: 'password1', email: 'ethan.davis21@gmail.com', userName: 'EthanD123' },
    { password: 'qwerty123', email: 'mia_johnson34@gmail.com', userName: 'Mia_J345' },
    { password: '12345678a', email: 'william_martin@hotmail.com', userName: 'Will_M789' },
    { password: '987654321a', email: 'sophia_anderson@gmail.com', userName: 'Soph_Anderson' },
    { password: 'abc123xyz', email: 'logan_jones56@yahoo.com', userName: 'LoganJones56' },
    { password: 'password12', email: 'amelia.brown12@gmail.com', userName: 'AmeliaB12' },
    { password: 'letmein12', email: 'jack.wilson789@gmail.com', userName: 'Jack_Wil789' },
    { password: 'iloveyou12', email: 'hannah_smithy@gmail.com', userName: 'Hannah_S123' },
    { password: '123qwe', email: 'owen.johnson456@gmail.com', userName: 'OwenJ456' },
    { password: 'qwe123', email: 'scarlett.wilson@yahoo.com', userName: 'ScarlettW123' },
    { password: '123abc', email: 'david.miller34@gmail.com', userName: 'David_M123' },
  ];
  //array stings for access token
  let arrAccessToken: string[] = [];
  let accessToken: string;
  //registration user
  it('01 - / (POST) - should create 21 users with status "active"', async () => {
    for (const command of commands) {
      accessToken = await authHelper.createUser(command, { expectedCode: 204 });
      arrAccessToken.push(accessToken);
    }
  });
  //Upload image for profile
  it('02 - / (POST) - should return 201 if all data is correct for upload image profile', async () => {
    let nameFile = '/modules/1000x667_304kb.jpeg';
    const responseBody: AvatarsViewModel = await usersHelper.uploadPhotoAvatar(nameFile, {
      token: arrAccessToken[3],
      expectedCode: 201,
    });
    expect(responseBody.avatars).toHaveLength(2);
    expect(responseBody.avatars[0].width).toBe(ImageSizeConfig.MEDIUM.defaultWidth);
    expect(responseBody.avatars[1].width).toBe(ImageSizeConfig.THUMBNAIL.defaultWidth);
  });
  it('03 - / (POST) - should return 201 if all data is correct for upload image profile', async () => {
    let nameFile = '/modules/image1.png';
    const responseBody: AvatarsViewModel = await usersHelper.uploadPhotoAvatar(nameFile, {
      token: arrAccessToken[5],
      expectedCode: 201,
    });
    expect(responseBody.avatars).toHaveLength(2);
    expect(responseBody.avatars[0].width).toBe(ImageSizeConfig.MEDIUM.defaultWidth);
    expect(responseBody.avatars[1].width).toBe(ImageSizeConfig.THUMBNAIL.defaultWidth);
  });
  it('04 - / (GET) - should return all users', async () => {
    const query = gql`
      query {
        users(pageSize: 50, pageNumber: 1) {
          pageSize
          page
          totalCount
          items {
            userId
            userName
            profileLink
            status
            createdAt
          }
        }
      }
    `;
    const body = await superAdminHelper.getUsers<PaginationUsersInputDto>(query);
    expect(body).toBeDefined();
    expect(body['users'].items.length).toBe(21);
    expect(body['users'].totalCount).toBe(21);
    expect(body['users'].pageSize).toBe(50);
    expect(body['users'].page).toBe(1);
    expect(body['users'].items[0].userName).toBe(commands[20].userName);
  });
  it('05 - / (GET) - should return all users with page 1', async () => {
    const query = gql`
      query {
        users(pageSize: 10, pageNumber: 1, search: "sc") {
          pageSize
          page
          totalCount
          items {
            userId
            userName
            profileLink
            status
            createdAt
          }
        }
      }
    `;
    const body = await superAdminHelper.getUsers<PaginationUsersInputDto>(query);
    expect(body['users'].items.length).toBe(1);
    expect(body['users'].totalCount).toBe(1);
    expect(body['users'].pageSize).toBe(10);
    expect(body['users'].items[0].userName).toBe(commands[19].userName);
  });
  it('06 - / (GET) - should return all users with page 3', async () => {
    const query = gql`
      query {
        users(pageNumber: 3, sortBy: userName, sortDirection: Asc) {
          pageSize
          page
          totalCount
          items {
            userId
            userName
            profileLink
            status
            createdAt
          }
        }
      }
    `;
    const body = await superAdminHelper.getUsers<PaginationUsersInputDto>(query);
    expect(body['users'].items.length).toBe(1);
    expect(body['users'].items[0].userName).toBe(commands[12].userName);
  });
  let profiles: ProfileViewModel[] = [];
  it('07 - / (GET) - should return 200 and profile of user', async () => {
    for (const token of arrAccessToken) {
      let profile: ProfileViewModel = await usersHelper.getMyProfile<ProfileViewModel>(token);
      profiles.push(profile);
    }
  });
  //delete user [0] and [13]
  it('08 - / (DELETE) - should return 200 if user deleted', async () => {
    const id = profiles[0].id;
    let query = `
      mutation {
        deleteUser(userId: ${id})
      }
    `;
    const body = await superAdminHelper.mutationCommand(query);
    expect(body.deleteUser).toBe(true);
  });
  it('09 - / (DELETE) - should return 200 if user deleted', async () => {
    const id2 = profiles[13].id;
    let query = `
      mutation {
        deleteUser(userId: ${id2})
      }
    `;
    const body = await superAdminHelper.mutationCommand(query);
    expect(body.deleteUser).toBe(true);
  });
  it('10 - / (GET) - should return 200 and profile of user', async () => {
    const query = gql`
      query {
        users(pageSize: 50, pageNumber: 1, status: active) {
          pageSize
          page
          totalCount
          items {
            userId
            userName
            profileLink
            status
            createdAt
          }
        }
      }
    `;
    const body = await superAdminHelper.getUsers<PaginationUsersInputDto>(query);
    expect(body).toBeDefined();
    expect(body['users'].items.length).toBe(19);
    expect(body['users'].totalCount).toBe(19);
    expect(body['users'].pageSize).toBe(50);
  });
  //ban two users [1] and [2]
  it('11 - / (POST) - should return 200 if user banned', async () => {
    const id = profiles[1].id;
    let query = `
      mutation {
        updateUserStatus(userId: ${id}, banReason: Bad_behavior, isBanned: true)
      }
    `;
    const body = await superAdminHelper.mutationCommand(query);
    expect(body.updateUserStatus).toBe(true);
  });
  it('12 - / (POST) - should return 200 if user banned', async () => {
    const id = profiles[2].id;
    let query = `
      mutation {
        updateUserStatus(userId: ${id}, banReason: Advertising_placement,  isBanned: true)
      }
    `;
    const body = await superAdminHelper.mutationCommand(query);
    expect(body.updateUserStatus).toBe(true);
  });
  //Get banned users
  it('13 - / (GET) - should return 200 and profile of user', async () => {
    const query = gql`
      query {
        users(pageSize: 50, pageNumber: 1, status: banned) {
          pageSize
          page
          totalCount
          items {
            userId
            userName
            profileLink
            status
            createdAt
          }
        }
      }
    `;
    const body = await superAdminHelper.getUsers<PaginationUsersInputDto>(query);
    expect(body).toBeDefined();
    expect(body['users'].items.length).toBe(2);
    expect(body['users'].totalCount).toBe(2);
    expect(body['users'].pageSize).toBe(50);
  });
  it('14 - / (GET) - should return 200 and profile with avatar of FIRST user', async () => {
    const body = await usersHelper.getMyProfile<ProfileViewModel>(arrAccessToken[1], { expectedCode: 200 });
    const body2 = await usersHelper.getMyProfile<ProfileViewModel>(arrAccessToken[2], { expectedCode: 200 });
    expect(body).toBeDefined();
    expect(body2).toBeDefined();
  });
  //unban one users [1]
  it('15 - / (POST) - should return 200 if user unbanned', async () => {
    const id = profiles[1].id;
    let query = `
      mutation {
        updateUserStatus(userId: ${id}, isBanned: false)
      }
    `;
    const body = await superAdminHelper.mutationCommand(query);
    expect(body.updateUserStatus).toBe(true);
  });
  //Get banned users
  it('16 - / (GET) - should return 200 and profile of user', async () => {
    const query = gql`
      query {
        users(pageSize: 50, pageNumber: 1, status: banned) {
          pageSize
          page
          totalCount
          items {
            userId
            userName
            profileLink
            status
            createdAt
          }
        }
      }
    `;
    const body = await superAdminHelper.getUsers<PaginationUsersInputDto>(query);
    expect(body).toBeDefined();
    expect(body['users'].items.length).toBe(1);
    expect(body['users'].totalCount).toBe(1);
    expect(body['users'].pageSize).toBe(50);
  });
  it('17 - / (POST) - should return 201 if all data is correct for create post', async () => {
    let nameFile = '/modules/1271х847_357kb.jpeg';
    const body = { description: 'This is my first post', nameFile: [nameFile] };
    await postsHelper.createPost<PostViewModel>(body, { token: arrAccessToken[5], expectedCode: 201 });
  });
  //login banned user [1]
  it('20 - / (POST) - should return 200 if password and email correct', async () => {
    const command = { password: commands[1].password, email: commands[1].email };
    await authHelper.login(command, { expectedCode: 200 });
  });
  it('20 - / (POST) - should return 200 if password and email correct', async () => {
    const command = { password: commands[2].password, email: commands[2].email };
    await authHelper.login(command, { expectedCode: 200 });
  });
});
