import { plainToInstance } from 'class-transformer';
import { PostEntity, PostStatus } from '../domain/post.entity';
import { ChildMetadataDto } from '../api/input-dto/create-post.input.dto';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export abstract class IPostsRepository {
  abstract newPost(instancePost: PostEntity): Promise<PostEntity>;
  abstract savePost(post: PostEntity): Promise<void>;
  abstract addImagesToPost(post: PostEntity): Promise<void>;
  abstract findPostById(postId: number): Promise<PostEntity>;
  abstract deletePostById(postId: number);
  abstract findPendingPostByUserId(userId: number): Promise<PostEntity>;
  abstract findPostByOwnerIdAndUploadIds(
    userId: number,
    childrenMetadata: ChildMetadataDto[],
    status: PostStatus,
  ): Promise<PostEntity>;
}

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async newPost(instancePost: PostEntity): Promise<PostEntity> {
    const post = await this.prisma.post.create({
      data: {
        ownerId: instancePost.ownerId,
        status: instancePost.status,
      },
      include: { images: true },
    });
    return plainToInstance(PostEntity, post);
  }

  async savePost(post: PostEntity): Promise<void> {
    await this.prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        description: post.description,
        location: post.location,
        status: post.status,
        images: {
          updateMany: post.images.map(i => ({
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
          })),
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

  async findPostById(postId: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: { images: true },
    });
    return plainToInstance(PostEntity, post);
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
}
