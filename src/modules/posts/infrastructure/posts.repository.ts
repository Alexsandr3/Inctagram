import { plainToInstance } from 'class-transformer';
import { PostEntity } from '../domain/post.entity';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/domain/user.entity';
import { ImagePostEntity } from '../domain/image-post.entity';

export abstract class IPostsRepository {
  abstract savePost(post: PostEntity): Promise<void>;
  abstract findPostWithOwnerById(postId: number): Promise<{ post: PostEntity; owner: UserEntity }>;
  abstract createPostWithImages(instancePost: PostEntity): Promise<number>;
  //unused
  /* abstract createPost(instancePost: PostEntity): Promise<number>;
  abstract saveImages(image: ImagePostEntity[]): Promise<void>;
  abstract deleteImages(resourceId: string): Promise<void>;
  abstract findImagesByOwnerIdAndResourceIds(resourceId: string): Promise<ImagePostEntity[]>;
  abstract findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]>;
  abstract deletePostById(postId: number);*/
}

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async savePost(post: PostEntity): Promise<void> {
    const updateImagesConfig = this.getUpdateImagesConfig(post.images);
    await this.prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        description: post.description,
        location: post.location,
        status: post.status,
        images: {
          updateMany: updateImagesConfig,
        },
      },
    });
  }
  async findPostWithOwnerById(postId: number): Promise<{ post: PostEntity; owner: UserEntity }> {
    const postWithUser = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
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
        where: {
          id: i.id,
        },
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
    //create post with images in one transaction
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
      await tx.postImage.createMany({
        data: images,
      });
      return post.id;
    });
  }
  //unused
  /*
  async createPost(instancePost: PostEntity): Promise<number> {
    //create post
    const ids = instancePost.images.map(i => {
      return {
        id: i.id,
      };
    });
    const updateImagesConfig = this.getUpdateImagesConfig(instancePost.images);

    return await this.prisma.$transaction(async tx => {
      const post = await tx.post.create({
        data: {
          ownerId: instancePost.ownerId,
          description: instancePost.description,
          location: instancePost.location,
          status: instancePost.status,
          images: { connect: ids },
        },
      });

      await tx.post.update({
        where: { id: post.id },
        data: {
          images: {
            updateMany: updateImagesConfig,
          },
        },
      });
      return post.id;
    });
  }
  async saveImages(images: ImagePostEntity[]): Promise<void> {
    await this.prisma.postImage.createMany({
      data: images,
    });
  }
  async deleteImages(resourceId: string): Promise<void> {
    await this.prisma.postImage.deleteMany({ where: { resourceId } });
  }
  async findImagesByOwnerIdAndResourceIds(resourceId: string): Promise<ImagePostEntity[]> {
    const images = await this.prisma.postImage.findMany({
      where: { resourceId },
    });
    return plainToInstance(ImagePostEntity, images);
  }
  async findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]> {
    const uploadIds = childrenMetadata.map(c => c.uploadId);
    const images = await this.prisma.postImage.findMany({
      where: {
        resourceId: {
          in: uploadIds,
        },
      },
    });
    return plainToInstance(ImagePostEntity, images);
  }
  //unused
  async deletePostById(postId: number) {
    await this.prisma.post.delete({
      where: {
        id: postId,
      },
      include: { images: true },
    });
  }*/
}
