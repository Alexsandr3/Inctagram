import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { PostsHelper } from '../helpers/posts-helper';
import { CreatePostInputDto } from '../../src/modules/posts/api/input-dto/create-post.input.dto';
import { PostImageViewModel } from '../../src/modules/posts/api/view-models/post-image-view.dto';

jest.setTimeout(120000);
describe('Posts flow - e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let postsHelper: PostsHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting(false);
    authHelper = new AuthHelper(app);
    postsHelper = new PostsHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // Data for registration and login
  let correctEmail_first_user = 'Nindzi77@yahoo.om';
  let correctUserName_first_user = 'Botsford';
  let correctEmail_second_user = 'Serenity_Fahey@hotmail.com';
  let correctUserName_second_user = 'Pauline';
  // Access tokens for users
  let accessToken: string;
  let accessToken2: string;

  // Registration and login 2 users
  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user, userName: correctUserName_first_user };
    const command2 = { password: '12345678', email: correctEmail_second_user, userName: correctUserName_second_user };
    accessToken = await authHelper.createUser(command, { expectedCode: 204 });
    accessToken2 = await authHelper.createUser(command2, { expectedCode: 204 });
  });

  // Upload image post - incorrect data
  it('10 - / (POST) - should return 400 if all data is incorrect for upload image post', async () => {
    let nameFile = '/images/email.html';
    const responseBody = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('file');
  });
  it('11 - / (POST) - should return 400 if all data is incorrect for upload image post', async () => {
    let nameFile = '/images/img-1028x312.txt';
    const responseBody = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('file');
  });
  it('20 - / (POST) - should return 400 if childrenMetadata  is incorrect for create post', async () => {
    const command = {
      description: 'Test post',
      childrenMetadata: [],
    };
    const responseBody = await postsHelper.createPost(command, { token: accessToken, expectedCode: 400 });
    expect(responseBody.messages[0].field).toBe('childrenMetadata');
    expect(responseBody.messages[0].message).toBe('childrenMetadata must contain at least 1 elements');
  });
  it('21 - / (POST) - should return 400 if description is incorrect for create post', async () => {
    const command = {
      description: 'e'.repeat(501),
      childrenMetadata: [{ uploadId: 1 }],
    };
    const responseBody = await postsHelper.createPost(command, { token: accessToken, expectedCode: 400 });
    expect(responseBody.messages[0].field).toBe('description');
  });

  //Upload image post -  by FIRST user - correct data
  let uploadId: number;
  let uploadId2: number;
  let uploadId3: number;
  it('50 - / (POST) - should return 201 if all data is correct for upload image post', async () => {
    let nameFile = '/images/1271х847_357kb.jpeg';
    const responseBody: PostImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId = responseBody.uploadId;
    expect(responseBody).toBeDefined();
    expect(responseBody).toEqual({
      url: expect.any(String),
      width: expect.any(Number),
      height: expect.any(Number),
      fileSize: expect.any(Number),
      uploadId: expect.any(Number),
    });
  });
  it('51 - / (POST) - should return 201 if all data is correct for upload image post', async () => {
    let nameFile = '/images/859x720_338kb.jpeg';
    const responseBody: PostImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId2 = responseBody.uploadId;
  });
  it('52 - / (POST) - should return 201 if all data is correct for upload image post', async () => {
    let nameFile = '/images/667x1000_345kb.jpeg';
    const responseBody: PostImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId3 = responseBody.uploadId;
  });
  it('53 - / (POST) - should return 201 if all data is correct for create post', async () => {
    const command: CreatePostInputDto = {
      description: 'Test post',
      childrenMetadata: [{ uploadId: uploadId }, { uploadId: uploadId2 }, { uploadId: uploadId3 }],
    };
    const responseBody = await postsHelper.createPost(command, { token: accessToken, expectedCode: 201 });
    expect(responseBody).toBeDefined();
  });
  it('54 - / (DELETE) - should return 204 if all data is correct for delete image post', async () => {
    await postsHelper.deletePhotoPost(uploadId, { token: accessToken, expectedCode: 204 });
  });
});
