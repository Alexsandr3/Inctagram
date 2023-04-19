import { plainToInstance } from 'class-transformer';
import { PostEntity, PostStatus } from '../domain/post.entity';
import { ChildMetadataDto } from '../api/input-dto/create-post.input.dto';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/domain/user.entity';
import { ImagePostEntity } from '../domain/image-post.entity';

export abstract class IPostsRepository {
  abstract newPost(instancePost: PostEntity): Promise<number>;
  abstract savePost(post: PostEntity): Promise<void>;
  abstract addImagesToPost(post: PostEntity): Promise<void>;
  abstract findPostWithOwnerById(postId: number): Promise<{ post: PostEntity; owner: UserEntity }>;
  abstract deletePostById(postId: number);
  abstract findPendingPostByUserId(userId: number): Promise<PostEntity>;
  abstract findPostByOwnerIdAndUploadIds(
    userId: number,
    childrenMetadata: ChildMetadataDto[],
    status: PostStatus,
  ): Promise<PostEntity>;

  abstract saveImages(image: ImagePostEntity[]): Promise<void>;

  abstract findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]>;
}

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async newPost(instancePost: PostEntity): Promise<number> {
    //create post
    const post = await this.prisma.post.create({
      data: {
        ownerId: instancePost.ownerId,
        description: instancePost.description,
        location: instancePost.location,
        status: instancePost.status,
      },
    });
    //update images
    await this.prisma.$transaction(
      instancePost.images.map(image =>
        this.prisma.postImage.update({
          where: { id: image.id },
          data: {
            postId: post.id,
            status: image.status,
            imageType: image.imageType,
            sizeType: image.sizeType,
            url: image.url,
            width: image.width,
            height: image.height,
            fileSize: image.fileSize,
            fieldId: image.fieldId,
          },
        }),
      ),
    );
    return post.id;
  }

  async savePost(post: PostEntity): Promise<void> {
    const images = post.images.map(i => {
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
        },
      };
    });
    await this.prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        description: post.description,
        location: post.location,
        status: post.status,
        images: {
          updateMany: images,
        },
      },
    });
  }

  async addImagesToPost(post: PostEntity): Promise<void> {
    await this.prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        images: {
          create: post.images.map(i => ({
            status: i.status,
            imageType: i.imageType,
            sizeType: i.sizeType,
            url: i.url,
            width: i.width,
            height: i.height,
            fileSize: i.fileSize,
            fieldId: i.fieldId,
          })),
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

  async deletePostById(postId: number) {
    console.log(postId);
    await this.prisma.post.delete({
      where: {
        id: postId,
      },
      include: { images: true },
    });
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
  }

  async findPendingPostByUserId(userId: number): Promise<PostEntity> {
    const post = await this.prisma.post.findFirst({
      where: {
        ownerId: userId,
        status: 'PENDING',
      },
      include: { images: true },
    });
    return plainToInstance(PostEntity, post);
  }

  async findPostByOwnerIdAndUploadIds(
    userId: number,
    childrenMetadata: ChildMetadataDto[],
    status: PostStatus,
  ): Promise<PostEntity> {
    const post = await this.prisma.post.findFirst({
      where: {
        ownerId: userId,
        status: status,
        images: {
          some: {
            id: {
              in: childrenMetadata.map(c => c.uploadId),
            },
          },
        },
      },
      include: { images: true },
    });
    return plainToInstance(PostEntity, post);
  }

  async saveImages(images: ImagePostEntity[]): Promise<void> {
    const postImages = images.map(i => {
      return {
        postId: i.postId,
        status: i.status,
        imageType: i.imageType,
        sizeType: i.sizeType,
        url: i.url,
        width: i.width,
        height: i.height,
        fileSize: i.fileSize,
        fieldId: i.fieldId,
      };
    });
    await this.prisma.postImage.createMany({
      data: postImages,
    });
  }

  async findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]> {
    const images = await this.prisma.postImage.findMany({
      where: {
        id: {
          in: childrenMetadata.map(c => c.uploadId),
        },
      },
    });
    return plainToInstance(ImagePostEntity, images);
  }
}
