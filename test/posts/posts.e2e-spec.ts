import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { PostsHelper } from '../helpers/posts-helper';
import { CreatePostInputDto } from '../../src/modules/posts/api/input-dto/create-post.input.dto';
import { PostViewModel } from '../../src/modules/posts/api/view-models/post-view.dto';
import { ApiErrorResultDto } from '../../src/main/validators/api-error-result.dto';
import { UpdatePostInputDto } from '../../src/modules/posts/api/input-dto/update-post.input.dto';
import { UploadedImageViewModel } from '../../src/modules/posts/api/view-models/uploaded-image-view.dto';

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
  let post2: PostViewModel;

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
  //uploadId for first image--
  let uploadId1: string;
  //uploadId for second image--
  let uploadId2: string;
  //uploadId for third image--
  let uploadId3: string;
  it('30 - / (POST) - should return 201 if all data is correct for upload image post', async () => {
    let nameFile = '/images/1271х847_357kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    expect(responseBody).toBeDefined();
    expect(responseBody.images).toHaveLength(2);
    uploadId1 = responseBody.images[0].uploadId;
    expect(responseBody.images).toEqual(
      expect.arrayContaining([
        {
          uploadId: expect.any(String),
          fileSize: expect.any(Number),
          height: expect.any(Number),
          url: expect.any(String),
          width: expect.any(Number),
        },
      ]),
    );
  });
  it('31 - / (POST) - should return 201 if all data is correct for upload image post', async () => {
    let nameFile = '/images/859x720_338kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId2 = responseBody.images[0].uploadId;
    uploadId2 = responseBody.images[1].uploadId;
  });
  it('32 - / (POST) - should return 201 if all data is correct for upload image post', async () => {
    let nameFile = '/images/667x1000_345kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId3 = responseBody.images[0].uploadId;
    uploadId3 = responseBody.images[1].uploadId;
  });
  it('33 - / (POST) - should return 201 if all data is correct for create post', async () => {
    const command: CreatePostInputDto = {
      description: 'Test post',
      childrenMetadata: [{ uploadId: uploadId1 }, { uploadId: uploadId2 }, { uploadId: uploadId3 }],
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
          uploadId: expect.any(String),
        },
      ]),
    });
    expect(responseBody.images.length).toBe(6);
    expect(responseBody).toBeDefined();
    post = responseBody;
  });
  it('34_1 - / (DELETE) - should return 204 if all data is correct for delete image post', async () => {
    await postsHelper.deletePhotoPost(uploadId1, { token: accessToken, expectedCode: 204 });
  });
  it('34_2 - / (DELETE) - should return 204 if all data is correct for delete image post', async () => {
    await postsHelper.deletePhotoPost(uploadId2, { token: accessToken, expectedCode: 204 });
  });
  it('34_3 - / (DELETE) - should return 204 if all data is correct for delete image post', async () => {
    await postsHelper.deletePhotoPost(uploadId3, { token: accessToken, expectedCode: 204 });
  });
  //Get post
  it('35 - / (GET) - should return 200 with empty array images', async () => {
    const foundPost: PostViewModel = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost.images).toHaveLength(0);
  });
  //Upload image post -  by SECOND user - correct data
  it('30 - / (POST) - should return 201 if all data is correct for upload image post', async () => {
    let nameFile = '/images/1000x667_304kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    expect(responseBody).toBeDefined();
    expect(responseBody.images).toHaveLength(2);
    uploadId1 = responseBody.images[0].uploadId;
    expect(responseBody.images).toEqual(
      expect.arrayContaining([
        {
          uploadId: expect.any(String),
          fileSize: expect.any(Number),
          height: expect.any(Number),
          url: expect.any(String),
          width: expect.any(Number),
        },
      ]),
    );
  });
  it('33 - / (POST) - should return 201 if all data is correct for create post', async () => {
    const command: CreatePostInputDto = {
      description: 'It is test post, please ignore it',
      childrenMetadata: [{ uploadId: uploadId1 }],
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
          uploadId: expect.any(String),
        },
      ]),
    });
    expect(responseBody.images.length).toBe(2);
    expect(responseBody).toBeDefined();
    post2 = responseBody;
  });

  //Get post
  it('40 - / (GET) - should return 200 and post without deleted image', async () => {
    const foundPost = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost).not.toEqual(post);
    expect(foundPost).toEqual({ ...post, updatedAt: expect.any(String), images: expect.anything() });
    expect(foundPost.images.length).toBe(0);
    post = foundPost;
  });

  //Update post
  it('41 - / (PUT) - should return 204 and update post', async () => {
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
  it('42 - / (PUT) - should return 400 for update post with bad data', async () => {
    const command: UpdatePostInputDto = { description: 'e'.repeat(501) };
    await postsHelper.updatePost(post.id, command, { token: accessToken, expectedCode: 400 });

    await postsHelper.updatePost(post.id, null, { token: accessToken, expectedCode: 400 });
  });
  it('43 - / (PUT) - should return 403 if user isn`t owner of post', async () => {
    let command: UpdatePostInputDto = { description: 'New super description' };
    const responseBody = await postsHelper.updatePost<ApiErrorResultDto>(post.id, command, {
      token: accessToken2,
      expectedCode: 403,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toContain(`User with id:`);
  });

  //Delete - incorrect data
  it('50 - / (DELETE) - should return 403 if user isn`t owner of post', async () => {
    const responseBody = await postsHelper.deletePost<ApiErrorResultDto>(post.id, {
      token: accessToken2,
      expectedCode: 403,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toContain(`User with id:`);
  });

  //Delete post
  it('55 - / (DELETE) - should return 204 and delete post. Get deleted post should return 404', async () => {
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
