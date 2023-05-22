import { INestApplication } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth-helper';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { PostsHelper } from '../helpers/posts-helper';
import { PostViewModel } from '../../src/modules/posts/api/view-models/post-view.dto';
import FormData from 'form-data';
import { ImageSizeConfig } from '../../src/modules/images/image-size-config.type';
import { ApiErrorResultDto } from '../../src/main/validators/api-error-result.dto';
import { Paginated } from '../../src/main/shared/paginated';

jest.setTimeout(120000);

describe('Testing new flow upload files and create post -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let postsHelper: PostsHelper;
  let formData: FormData;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
    postsHelper = new PostsHelper(app);
    formData = new FormData();
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
  let post3: PostViewModel;
  let uploadId0: string;
  let uploadId0_1: string;
  //uploadId for second image--
  let uploadId2_0: string;
  //uploadId for third image--
  let uploadId2_1: string;
  let uploadId2_2: string;
  // Registration and login 2 users
  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user, userName: correctUserName_first_user };
    const command2 = { password: '12345678', email: correctEmail_second_user, userName: correctUserName_second_user };
    accessToken = await authHelper.createUser(command, { expectedCode: 204 });
    accessToken2 = await authHelper.createUser(command2, { expectedCode: 204 });
  });
  it('02 - / (POST) - should return 400 if length of description > 500', async () => {
    let nameFile = '/images/image2.jpeg';
    const body = { description: 'e'.repeat(501), nameFile: [nameFile] };
    const response = await postsHelper.createPost<ApiErrorResultDto>(body, { token: accessToken, expectedCode: 400 });
    expect(response.messages[0].field).toBe('description');
  });
  it('03 - / (POST) - should return 400 if type image is not jpg, jpeg or png', async () => {
    let nameFile = '/images/image2.jpeg';
    let nameFile2 = '/images/image1.png';
    let nameFile3 = '/images/email.html';
    const body = { description: 'New super description', nameFile: [nameFile, nameFile2, nameFile3] };
    const response = await postsHelper.createPost<ApiErrorResultDto>(body, { token: accessToken, expectedCode: 400 });
    expect(response.messages[0].field).toBe('file');
  });
  it('04 - / (POST) - should return 400 if size of image > 5mb', async () => {
    let nameFile = '/images/europe_24.9mb.png';
    const body = { description: 'New super description', nameFile: [nameFile] };
    const response = await postsHelper.createPost<ApiErrorResultDto>(body, { token: accessToken, expectedCode: 400 });
    expect(response.messages[0].field).toBe('file');
  });
  //Get nonexistent post
  it('10 - / (GET) - should return 404 if post isn`t exist', async () => {
    const postId = -5;
    const responseBody = await postsHelper.getPost<ApiErrorResultDto>(postId, {
      token: accessToken,
      expectedCode: 404,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toBe(`Post with id: ${postId} not found`);
  });
  //Delete - incorrect data
  it('11 - / (DELETE) - should return 404 if post isn`t exist', async () => {
    const postId = -5;
    const responseBody = await postsHelper.deletePost<ApiErrorResultDto>(postId, {
      token: accessToken,
      expectedCode: 404,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toBe(`Post with id: ${postId} not found`);
  });

  //Create 2 posts - correct data - uploadId1 - for first user
  it('15 - / (POST) - should return 201 if all data is correct for create post', async () => {
    let nameFile = '/images/1271х847_357kb.jpeg';
    const body = { description: 'This is my first post', nameFile: [nameFile] };
    post = await postsHelper.createPost<PostViewModel>(body, { token: accessToken, expectedCode: 201 });
    uploadId0 = post.images[0].uploadId;
  });
  it('16 - / (POST) - should return 201 if all data is correct for create post', async () => {
    let nameFile = '/images/859x720_338kb.jpeg';
    const body = { description: 'This is my second post', nameFile: [nameFile] };
    post2 = await postsHelper.createPost<PostViewModel>(body, { token: accessToken, expectedCode: 201 });
    uploadId0_1 = post2.images[0].uploadId;
  });

  //Create post - correct data - uploadId2_0 and upload2_1 and uploadId2_2 - for second user
  it('17 - / (POST) - should return 201 if all data is correct for create post', async () => {
    let nameFile = '/images/667x1000_345kb.jpeg';
    let nameFile1 = '/images/1271х847_357kb.jpeg';
    let nameFile2 = '/images/image1.png';
    const body = {
      description: 'It is my discovery of the day',
      nameFile: [nameFile, nameFile1, nameFile2],
    };
    post3 = await postsHelper.createPost<PostViewModel>(body, { token: accessToken2, expectedCode: 201 });
    uploadId2_0 = post3.images[0].uploadId;
    uploadId2_1 = post3.images[1].uploadId;
    uploadId2_2 = post3.images[2].uploadId;
    expect(post3.images).toHaveLength(3);
  });

  //Get existing post
  let userId: number;
  let userId2: number;
  it('41 - / (GET) - should return 200 and info about logged user', async () => {
    const myInfo = await authHelper.me(accessToken);
    const myInfo2 = await authHelper.me(accessToken2);
    userId = myInfo.userId;
    userId2 = myInfo2.userId;
  });
  it('42 - / (GET) - should return 200 posts with pagination for FIRST user', async () => {
    const responseBody: Paginated<PostViewModel[]> = await postsHelper.getPosts(userId, null, {
      token: accessToken,
      expectedCode: 200,
    });
    expect(responseBody).toBeDefined();
    expect(responseBody.items).toHaveLength(2);
    expect(responseBody.items[0].id).toBe(post2.id);
    expect(responseBody.items[1].id).toBe(post.id);
    expect(responseBody.items[0].images).toHaveLength(1);
    expect(responseBody.items[1].images).toHaveLength(1);
  });
  it('43 - / (GET) - should return 200 posts with pagination for SECOND user', async () => {
    const responseBody: Paginated<PostViewModel[]> = await postsHelper.getPosts(userId2, null, {
      token: accessToken2,
      expectedCode: 200,
    });
    expect(responseBody).toBeDefined();
    expect(responseBody.items).toHaveLength(1);
    expect(responseBody.items[0].id).toBe(post3.id);
    expect(responseBody.items[0].images).toHaveLength(3);
  });

  //Get post
  it('50 - / (GET) - should return 200 with empty array images', async () => {
    const foundPost: PostViewModel = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost.images).toHaveLength(1);
    expect(foundPost.id).toBe(post.id);
  });

  // Registration correct data
  let accessToken3: string;
  let correctEmail_first_user3 = 'Kiarra92@yahoo.om';
  let correctUserName_first_user3 = 'Anderson';
  let post4: PostViewModel;
  let uploadId1: string;
  let uploadId2: string;
  let uploadId3: string;
  it('20 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user3, userName: correctUserName_first_user3 };
    accessToken3 = await authHelper.createUser(command, { expectedCode: 204 });
  });
  it('21 - / (POST) - should return 201 if all data is correct for create post', async () => {
    let nameFile = '/images/image2.jpeg';
    let nameFile2 = '/images/image1.png';
    let nameFile3 = '/images/667x1000_345kb.jpeg';
    const body = { description: 'New super description', nameFile: [nameFile, nameFile2, nameFile3] };
    const responseBody: PostViewModel = await postsHelper.createPost(body, {
      token: accessToken3,
      expectedCode: 201,
    });
    post4 = responseBody;
    uploadId1 = responseBody.images[0].uploadId;
    uploadId2 = responseBody.images[1].uploadId;
    uploadId3 = responseBody.images[2].uploadId;
    expect(responseBody.images).toHaveLength(3);
    //versions: { huge: [Object] }
    expect(responseBody.images[0].versions.huge).toHaveProperty('url');
    expect(responseBody.images[0].versions.huge).toHaveProperty('width');
    expect(responseBody.images[0].versions.huge).toHaveProperty('height');
    expect(responseBody.images[0].versions.huge).toEqual({
      url: expect.any(String),
      width: ImageSizeConfig.HUGE_HD16_9.defaultWidth,
      height: ImageSizeConfig.HUGE_HD16_9.defaultHeight,
      fileSize: expect.any(Number),
    });
    expect(responseBody.images[1].versions.huge).toEqual({
      url: expect.any(String),
      width: ImageSizeConfig.HUGE_HD1_1.defaultWidth,
      height: ImageSizeConfig.HUGE_HD1_1.defaultHeight,
      fileSize: expect.any(Number),
    });
    expect(responseBody.images[2].versions.huge).toEqual({
      url: expect.any(String),
      width: ImageSizeConfig.HUGE_HD4_5.defaultWidth,
      height: ImageSizeConfig.HUGE_HD4_5.defaultHeight,
      fileSize: expect.any(Number),
    });
    expect(responseBody.images[0].versions.huge).toHaveProperty('url');
    // versions: { large: [Object] }
    expect(responseBody.images[0].versions.large).toHaveProperty('url');
    expect(responseBody.images[0].versions.large).toHaveProperty('width');
    expect(responseBody.images[0].versions.large).toHaveProperty('height');
    expect(responseBody.images[0].versions.large).toHaveProperty('url');
    expect(responseBody.images[0].versions.large).toEqual({
      url: expect.any(String),
      width: ImageSizeConfig.LARGE16_9.defaultWidth,
      height: ImageSizeConfig.LARGE16_9.defaultHeight,
      fileSize: expect.any(Number),
    });
    expect(responseBody.images[1].versions.large).toEqual({
      url: expect.any(String),
      width: ImageSizeConfig.LARGE1_1.defaultWidth,
      height: ImageSizeConfig.LARGE1_1.defaultHeight,
      fileSize: expect.any(Number),
    });
    expect(responseBody.images[2].versions.large).toEqual({
      url: expect.any(String),
      width: ImageSizeConfig.LARGE4_5.defaultWidth,
      height: ImageSizeConfig.LARGE4_5.defaultHeight,
      fileSize: expect.any(Number),
    });

    expect(responseBody.description).toBe(body.description);
  });
  //delete image
  it('22 - / (DELETE) - should return 204 and delete image', async () => {
    const query = { postId: post4.id, uploadId: uploadId1 };
    await postsHelper.deleteImage(query, { token: accessToken3, expectedCode: 204 });
  });
  //get post
  it('23 - / (GET) - should return 200 and post without deleted image', async () => {
    const foundPost: PostViewModel = await postsHelper.getPost(post4.id, { token: accessToken3, expectedCode: 200 });
    expect(foundPost.images).toHaveLength(2);
  });
  //delete image
  it('24 - / (DELETE) - should return 204 and delete image', async () => {
    const query = { postId: post4.id, uploadId: uploadId2 };
    await postsHelper.deleteImage(query, { token: accessToken3, expectedCode: 204 });
  });
  //get post
  it('25 - / (GET) - should return 200 and post without deleted image', async () => {
    const foundPost: PostViewModel = await postsHelper.getPost(post4.id, { token: accessToken3, expectedCode: 200 });
    expect(foundPost.images).toHaveLength(1);
  });
  //delete image
  it('26 - / (DELETE) - should return 403 so user can`t delete last image', async () => {
    const query = { postId: post4.id, uploadId: uploadId3 };
    const responseBody = await postsHelper.deleteImage(query, {
      token: accessToken3,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toBe(`Post with id: ${post4.id} must have at least one image`);
  });
  //new post
  it('27 - / (POST) - should return 201 if all data is correct for create post', async () => {
    let nameFile = '/images/image2.jpeg';
    let nameFile2 = '/images/image1.png';
    let nameFile3 = '/images/667x1000_345kb.jpeg';
    let nameFile4 = '/images/859x720_338kb.jpeg';
    let nameFile5 = '/images/940x432_63kb.jpeg';
    let nameFile6 = '/images/940x432_70kb.jpeg';
    let nameFile7 = '/images/1000x667_304kb.jpeg';
    let nameFile8 = '/images/1028x312_99kb.jpg';
    let nameFile9 = '/images/1271х847_357kb.jpeg';
    let nameFile10 = '/images/elephants.jpg';
    let nameFile11 = '/images/River_5mb.jpeg';
    const body = {
      description: 'New super description',
      nameFile: [
        nameFile,
        nameFile2,
        nameFile3,
        nameFile4,
        nameFile5,
        nameFile6,
        nameFile7,
        nameFile8,
        nameFile9,
        nameFile10,
        nameFile11,
      ],
    };
    const responseBody: ApiErrorResultDto = await postsHelper.createPost(body, {
      token: accessToken3,
      expectedCode: 400,
    });
    expect(responseBody.messages[0].field).toBe('file');
  });
});

/*

describe('Posts flow - e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let postsHelper: PostsHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
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
  let post3: PostViewModel;

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

  //-----------Upload image for future post -  by FIRST user - correct data----------------
  //uploadId for first image--
  let uploadId1: string;
  let uploadId1_1: string;
  //uploadId for second image--
  let uploadId2: string;
  //uploadId for third image--
  let uploadId3: string;
  it('30 - / (POST) - should return 201 if all data is correct for upload (1-photo) image post', async () => {
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
  it('31 - / (POST) - should return 201 if all data is correct for upload (2-photo) image post', async () => {
    let nameFile = '/images/859x720_338kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId2 = responseBody.images[0].uploadId;
    uploadId2 = responseBody.images[1].uploadId;
  });
  //When user rollback post,
  it('32 - / (DELETE) - should return 204 if all data is correct for delete image post', async () => {
    await postsHelper.deletePhotoPost(uploadId1, { token: accessToken, expectedCode: 204 });
  });
  it('33 - / (DELETE) - should return 204 if all data is correct for delete image post', async () => {
    await postsHelper.deletePhotoPost(uploadId2, { token: accessToken, expectedCode: 204 });
  });
  it('33.1 - / (DELETE) - should return 404 if deleted image not found', async () => {
    const result: ApiErrorResultDto = await postsHelper.deletePhotoPost(uploadId2, {
      token: accessToken,
      expectedCode: 404,
    });
    expect(result.messages[0].field).toBe('image');
  });

  //Create 2 posts - correct data - uploadId1 - for first user
  it('34 - / (POST) - should return 201 if all data is correct for upload (1-photo) image post', async () => {
    let nameFile = '/images/667x1000_345kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId1 = responseBody.images[0].uploadId;
    uploadId1 = responseBody.images[1].uploadId;
  });
  it('35 - / (POST) - should return 201 if all data is correct for create post', async () => {
    const command: CreatePostInputDto = {
      description: 'Test post',
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
    expect(responseBody.images[0].uploadId).toBe(responseBody.images[1].uploadId);
    expect(responseBody.images.length).toBe(2);
    expect(responseBody).toBeDefined();
    post = responseBody;
  });
  it('36 - / (POST) - should return 201 if all data is correct for upload (1_1-photo) image post', async () => {
    let nameFile = '/images/667x1000_345kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken,
      expectedCode: 201,
    });
    uploadId1_1 = responseBody.images[0].uploadId;
    uploadId1_1 = responseBody.images[1].uploadId;
  });
  it('37 - / (POST) - should return 201 if all data is correct for create post', async () => {
    const command: CreatePostInputDto = {
      description: 'This post created for test, please, do not delete, thank you!',
      childrenMetadata: [{ uploadId: uploadId1_1 }],
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
    expect(responseBody.images[0].uploadId).toBe(responseBody.images[1].uploadId);
    expect(responseBody.images.length).toBe(2);
    expect(responseBody).toBeDefined();
    post2 = responseBody;
  });

  //Create post - correct data - uploadId2 and upload3 - for second user
  it('38 - / (POST) - should return 201 if all data is correct for upload (2-photo) image post', async () => {
    let nameFile = '/images/667x1000_345kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken2,
      expectedCode: 201,
    });
    uploadId2 = responseBody.images[0].uploadId;
    uploadId2 = responseBody.images[1].uploadId;
  });
  it('39 - / (POST) - should return 201 if all data is correct for upload (3-photo) image post', async () => {
    let nameFile = '/images/1271х847_357kb.jpeg';
    const responseBody: UploadedImageViewModel = await postsHelper.uploadPhotoPost(nameFile, {
      token: accessToken2,
      expectedCode: 201,
    });
    uploadId3 = responseBody.images[0].uploadId;
    uploadId3 = responseBody.images[1].uploadId;
  });
  it('40 - / (POST) - should return 201 if all data is correct for create post', async () => {
    const command: CreatePostInputDto = {
      description: 'Test post',
      childrenMetadata: [{ uploadId: uploadId2 }, { uploadId: uploadId3 }],
    };
    const responseBody: PostViewModel = await postsHelper.createPost(command, {
      token: accessToken2,
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
    expect(responseBody.images.length).toBe(4);
    expect(responseBody).toBeDefined();
    post3 = responseBody;
  });

  //Get existing post
  let userId: number;
  let userId2: number;
  it('41 - / (GET) - should return 200 and info about logged user', async () => {
    const myInfo = await authHelper.me(accessToken);
    const myInfo2 = await authHelper.me(accessToken2);
    userId = myInfo.userId;
    userId2 = myInfo2.userId;
  });
  it('42 - / (GET) - should return 200 posts with pagination for FIRST user', async () => {
    const responseBody: Paginated<PostViewModel[]> = await postsHelper.getPosts(userId, null, {
      token: accessToken,
      expectedCode: 200,
    });
    expect(responseBody).toBeDefined();
    expect(responseBody.items).toHaveLength(2);
    expect(responseBody.items[0].id).toBe(post2.id);
    expect(responseBody.items[1].id).toBe(post.id);
    expect(responseBody.items[0].images).toHaveLength(2);
    expect(responseBody.items[1].images).toHaveLength(2);
  });
  it('43 - / (GET) - should return 200 posts with pagination for SECOND user', async () => {
    const responseBody: Paginated<PostViewModel[]> = await postsHelper.getPosts(userId2, null, {
      token: accessToken2,
      expectedCode: 200,
    });
    expect(responseBody).toBeDefined();
    expect(responseBody.items).toHaveLength(1);
    expect(responseBody.items[0].id).toBe(post3.id);
    expect(responseBody.items[0].images).toHaveLength(4);
  });

  //Get post
  it('50 - / (GET) - should return 200 with empty array images', async () => {
    const foundPost: PostViewModel = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost.images).toHaveLength(2);
    expect(foundPost.id).toBe(post.id);
  });

  it('51 - / (POST) - should return 201 if all data is correct for create post', async () => {
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
  it('52 - / (GET) - should return 200 and post without deleted image', async () => {
    const foundPost = await postsHelper.getPost(post.id, { token: accessToken, expectedCode: 200 });
    expect(foundPost).not.toEqual(post);
    expect(foundPost).toEqual({ ...post, updatedAt: expect.any(String), images: expect.anything() });
    expect(foundPost.images.length).toBe(0);
    post = foundPost;
  });

  //Update post
  it('53 - / (PUT) - should return 204 and update post', async () => {
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
  it('54 - / (PUT) - should return 400 for update post with bad data', async () => {
    const command: UpdatePostInputDto = { description: 'e'.repeat(501) };
    await postsHelper.updatePost(post.id, command, { token: accessToken, expectedCode: 400 });

    await postsHelper.updatePost(post.id, null, { token: accessToken, expectedCode: 400 });
  });
  it('55 - / (PUT) - should return 403 if user isn`t owner of post', async () => {
    let command: UpdatePostInputDto = { description: 'New super description' };
    const responseBody = await postsHelper.updatePost<ApiErrorResultDto>(post.id, command, {
      token: accessToken2,
      expectedCode: 403,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toContain(`User with id:`);
  });

  //Delete - incorrect data
  it('56 - / (DELETE) - should return 403 if user isn`t owner of post', async () => {
    const responseBody = await postsHelper.deletePost<ApiErrorResultDto>(post.id, {
      token: accessToken2,
      expectedCode: 403,
    });
    expect(responseBody.messages[0].field).toBe('post');
    expect(responseBody.messages[0].message).toContain(`User with id:`);
  });

  //Delete post
  it('57 - / (DELETE) - should return 204 and delete post. Get deleted post should return 404', async () => {
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
*/
