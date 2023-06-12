import { plainToInstance } from 'class-transformer';
import { PostEntity } from '../domain/post.entity';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/domain/user.entity';
import { ImagePostEntity } from '../domain/image-post.entity';
import { PostForSuperAdminViewModel } from '../../super-admin/api/models/post-for-super-admin-view.model';
import { UserStatus } from '@prisma/client';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';

/**
 * Abstract class for posts repository
 * ['savePost', 'findPostWithOwnerById', 'createPostWithImages', 'getPostsById']
 */
export abstract class IPostsRepository {
  abstract savePost(post: PostEntity, event?: OutboxEventEntity): Promise<void>;
  abstract findPostWithOwnerById(postId: number): Promise<{ post: PostEntity; owner: UserEntity }>;
  abstract createPostWithImages(instancePost: PostEntity): Promise<number>;

  abstract getPostsById(userId: number): Promise<PostForSuperAdminViewModel[]>;
  //unused
  /* abstract createPost(instancePost: PostEntity): Promise<number>;
  abstract saveImages(image: ImagePostEntity[]): Promise<void>;
  abstract deleteImages(resourceId: string): Promise<void>;
  abstract findImagesByOwnerIdAndResourceIds(resourceId: string): Promise<ImagePostEntity[]>;
  abstract findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]>;
  abstract deletePostById(postId: number);*/
  abstract getPostsByIds(ids: number[]): Promise<PostForSuperAdminViewModel[]>;

  abstract getPostsCountByUserId(userId: number): Promise<number>;

  abstract getImagesCountByUserId(userId: number): Promise<number>;
}

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async savePost(post: PostEntity, event?: OutboxEventEntity): Promise<void> {
    const updateImagesConfig = this.getUpdateImagesConfig(post.images);
    return await this.prisma.$transaction(async tx => {
      await tx.post.update({
        where: { id: post.id },
        data: {
          description: post.description,
          location: post.location,
          status: post.status,
          images: {
            updateMany: updateImagesConfig,
          },
        },
      });
      if (event) {
        await tx.outBoxEvent.create({
          data: {
            userId: event.userId,
            senderService: event.senderService,
            eventName: event.eventName,
            payload: event.payload,
          },
        });
      }
    });
  }
  async findPostWithOwnerById(postId: number): Promise<{ post: PostEntity; owner: UserEntity }> {
    const postWithUser = await this.prisma.post.findFirst({
      where: { id: postId },
      include: { images: true, user: true },
    });
    if (!postWithUser) return { post: null, owner: null };

    const post = plainToInstance(PostEntity, postWithUser);
    const owner = plainToInstance(UserEntity, postWithUser.user);
    return { post: post, owner: owner };
  }
  private getUpdateImagesConfig(images: ImagePostEntity[]) {
    return images.map(i => {
      return {
        where: { id: i.id },
        data: {
          status: i.status,
          imageType: i.imageType,
          sizeType: i.sizeType,
          url: i.url,
          width: i.width,
          height: i.height,
          fileSize: i.fileSize,
          fieldId: i.fieldId,
          resourceId: i.resourceId,
        },
      };
    });
  }
  async createPostWithImages(instancePost: PostEntity): Promise<number> {
    //create post with modules in one transaction
    return await this.prisma.$transaction(async tx => {
      const post = await tx.post.create({
        data: {
          ownerId: instancePost.ownerId,
          description: instancePost.description,
          location: instancePost.location,
          status: instancePost.status,
          images: {
            create: [],
          },
        },
      });
      const images = instancePost.images.map(i => {
        return {
          postId: post.id,
          status: i.status,
          imageType: i.imageType,
          sizeType: i.sizeType,
          url: i.url,
          width: i.width,
          height: i.height,
          fileSize: i.fileSize,
          fieldId: i.fieldId,
          resourceId: i.resourceId,
        };
      });
      await tx.postImage.createMany({ data: images });
      return post.id;
    });
  }

  async getPostsById(userId: number): Promise<PostForSuperAdminViewModel[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        ownerId: userId,
        user: { status: { notIn: [UserStatus.DELETED] } },
      },
      include: { images: true },
    });
    const postsWithImages = plainToInstance(PostEntity, posts);
    return postsWithImages.map(p => PostForSuperAdminViewModel.createIns(p));
  }

  async getPostsByIds(ids: number[]): Promise<PostForSuperAdminViewModel[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        ownerId: { in: ids },
        user: { status: { notIn: [UserStatus.DELETED] } },
      },
      include: { images: true },
    });
    const postsWithImages = plainToInstance(PostEntity, posts);
    return postsWithImages.map(p => PostForSuperAdminViewModel.createIns(p));
  }
  async getPostsCountByUserId(userId: number): Promise<number> {
    return this.prisma.post.count({
      where: { ownerId: userId, user: { status: { notIn: [UserStatus.DELETED] } } },
    });
  }
  async getImagesCountByUserId(userId: number): Promise<number> {
    const count = await this.prisma.postImage.count({
      where: { post: { ownerId: userId, user: { status: { notIn: [UserStatus.DELETED] } } } },
    });
    return count / 2;
  }
}

//unused
/*
async createPost(instancePost: PostEntity): Promise<number> {
  //create post
  const ids = instancePost.modules.map(i => {
    return {
      id: i.id,
    };
  });
  const updateImagesConfig = this.getUpdateImagesConfig(instancePost.modules);

  return await this.prisma.$transaction(async tx => {
    const post = await tx.post.create({
      data: {
        ownerId: instancePost.ownerId,
        description: instancePost.description,
        location: instancePost.location,
        status: instancePost.status,
        modules: { connect: ids },
      },
    });

    await tx.post.update({
      where: { id: post.id },
      data: {
        modules: {
          updateMany: updateImagesConfig,
        },
      },
    });
    return post.id;
  });
}
async saveImages(modules: ImagePostEntity[]): Promise<void> {
  await this.prisma.postImage.createMany({
    data: modules,
  });
}
async deleteImages(resourceId: string): Promise<void> {
  await this.prisma.postImage.deleteMany({ where: { resourceId } });
}
async findImagesByOwnerIdAndResourceIds(resourceId: string): Promise<ImagePostEntity[]> {
  const modules = await this.prisma.postImage.findMany({
    where: { resourceId },
  });
  return plainToInstance(ImagePostEntity, modules);
}
async findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]> {
  const uploadIds = childrenMetadata.map(c => c.uploadId);
  const modules = await this.prisma.postImage.findMany({
    where: {
      resourceId: {
        in: uploadIds,
      },
    },
  });
  return plainToInstance(ImagePostEntity, modules);
}
//unused
async deletePostById(postId: number) {
  await this.prisma.post.delete({
    where: {
      id: postId,
    },
    include: { modules: true },
  });
}*/
