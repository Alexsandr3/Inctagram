import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { PostsHelper } from '../helpers/posts-helper';
import { CreatePostInputDto } from '../../src/modules/posts/api/input-dto/create-post.input.dto';
import { PostImageViewModel } from '../../src/modules/posts/api/view-models/post-image-view.dto';
import { PostViewModel } from '../../src/modules/posts/api/view-models/post-view.dto';
import { ApiErrorResultDto } from '../../src/main/validators/api-error-result.dto';
import { UpdatePostInputDto } from '../../src/modules/posts/api/input-dto/update-post.input.dto';

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
  //created Post
  let post: PostViewModel;

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
    const responseBody = await postsHelper.createPost<ApiErrorResultDto>(command, {
      token: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('childrenMetadata');
    expect(responseBody.messages[0].message).toBe('childrenMetadata must contain at least 1 elements');
  });
  it('21 - / (POST) - should return 400 if description is incorrect for create post', async () => {
    const command = {
      description: 'e'.repeat(501),
      childrenMetadata: [{ uploadId: 1 }],
    };
    const responseBody = await postsHelper.createPost<ApiErrorResultDto>(command, {
      token: accessToken,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('description');
  });
  //Get nonexistent post
  it('22 - / (GET) - should return 404 if post isn`t exist', async () => {
    const postId = -5;
    const responseBody = await postsHelper.getPost<ApiErrorResultDto>(postId, {
      token: accessToken,
      expectedCode: 404,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toBe(`Post with id: ${postId} not found`);
  });
  //Delete - incorrect data
  it('23 - / (DELETE) - should return 404 if post isn`t exist', async () => {
    const postId = -5;
    const responseBody = await postsHelper.deletePost<ApiErrorResultDto>(postId, {
      token: accessToken,
      expectedCode: 404,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toBe(`Post with id: ${postId} not found`);
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
    const responseBody: PostViewModel = await postsHelper.createPost(command, {
      token: accessToken,
      expectedCode: 201,
    });

    expect(responseBody).toEqual({
      id: expect.any(Number),
      description: command.description,
      location: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      images: expect.arrayContaining([
        {
          url: expect.any(String),
          width: expect.any(Number),
          height: expect.any(Number),
          fileSize: expect.any(Number),
          uploadId: expect.any(Number),
        },
      ]),
    });
    expect(responseBody.images.length).toBe(3);
    expect(responseBody).toBeDefined();
    post = responseBody;
  });
  it('54 - / (DELETE) - should return 204 if all data is correct for delete image post', async () => {
    await postsHelper.deletePhotoPost(uploadId, { token: accessToken, expectedCode: 204 });
  });
  //Get post
  it('55 - / (GET) - should return 200 and post without deleted image', async () => {
    const foundPost = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost).not.toEqual(post);
    expect(foundPost).toEqual({ ...post, updatedAt: expect.any(String), images: expect.anything() });
    expect(foundPost.updatedAt).not.toBe(post.updatedAt);
    expect(foundPost.images.length).toBe(2);
    post = foundPost;
  });

  //Update post
  it('56 - / (PUT) - should return 204 and update post', async () => {
    let command: UpdatePostInputDto = { description: 'New super description' };
    await postsHelper.updatePost(post.id, command, { token: accessToken, expectedCode: 204 });

    let foundPost = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost).not.toEqual(post);
    expect(foundPost).toEqual({ ...post, ...command, updatedAt: expect.any(String) });
    expect(foundPost.updatedAt).not.toBe(post.updatedAt);

    command = { description: '' };
    await postsHelper.updatePost(post.id, command, { token: accessToken, expectedCode: 204 });

    foundPost = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost).not.toEqual(post);
    expect(foundPost).toEqual({ ...post, ...command, updatedAt: expect.any(String) });
    expect(foundPost.updatedAt).not.toBe(post.updatedAt);
  });
  it('57 - / (PUT) - should return 400 for update post with bad data', async () => {
    const command: UpdatePostInputDto = { description: 'e'.repeat(501) };
    await postsHelper.updatePost(post.id, command, { token: accessToken, expectedCode: 400 });

    await postsHelper.updatePost(post.id, null, { token: accessToken, expectedCode: 400 });
  });
  it('58 - / (PUT) - should return 403 if user isn`t owner of post', async () => {
    let command: UpdatePostInputDto = { description: 'New super description' };
    const responseBody = await postsHelper.updatePost<ApiErrorResultDto>(post.id, command, {
      token: accessToken2,
      expectedCode: 403,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toContain(`User with id:`);
  });

  //Delete - incorrect data
  it('59 - / (DELETE) - should return 403 if user isn`t owner of post', async () => {
    const responseBody = await postsHelper.deletePost<ApiErrorResultDto>(post.id, {
      token: accessToken2,
      expectedCode: 403,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toContain(`User with id:`);
  });

  //Delete post
  it('60 - / (DELETE) - should return 204 and delete post. Get deleted post should return 404', async () => {
    await postsHelper.deletePost(post.id, {
      token: accessToken,
      expectedCode: 204,
    });
    const responseBody = await postsHelper.getPost<ApiErrorResultDto>(post.id, {
      token: accessToken,
      expectedCode: 404,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toBe(`Post with id: ${post.id} not found`);
  });
});
