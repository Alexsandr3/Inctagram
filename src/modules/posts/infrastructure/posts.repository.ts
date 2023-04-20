import { plainToInstance } from 'class-transformer';
import { PostEntity, PostStatus } from '../domain/post.entity';
import { ChildMetadataDto } from '../api/input-dto/create-post.input.dto';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/domain/user.entity';
import { ImagePostEntity } from '../domain/image-post.entity';

export abstract class IPostsRepository {
  abstract createPost(instancePost: PostEntity): Promise<number>;
  abstract saveImages(image: ImagePostEntity[]): Promise<void>;
  abstract deleteImages(image: ImagePostEntity[]): Promise<void>;
  abstract findImageByOwnerIdAndResourceIds(
    userId: number,
    metadata: { uploadId: string }[],
    PENDING: PostStatus.PENDING,
  ): Promise<ImagePostEntity[]>;
  abstract findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]>;
  //two flow
  abstract savePost(post: PostEntity): Promise<void>;
  abstract findPostWithOwnerById(postId: number): Promise<{ post: PostEntity; owner: UserEntity }>;

  //unused
  abstract updateImages(image: ImagePostEntity[]): Promise<void>;
  abstract deletePostById(postId: number);
  abstract findPendingPostByUserId(userId: number): Promise<PostEntity>;
}

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPost(instancePost: PostEntity): Promise<number> {
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
            resourceId: image.resourceId,
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
  async saveImages(images: ImagePostEntity[]): Promise<void> {
    const postImages = images.map(i => {
      return {
        postId: i.postId,
        resourceId: i.resourceId,
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

  async deleteImages(images: ImagePostEntity[]): Promise<void> {
    await this.prisma.$transaction(
      images.map(image =>
        this.prisma.postImage.delete({
          where: { id: image.id },
        }),
      ),
    );
  }
  async findImageByOwnerIdAndResourceIds(
    userId: number,
    metadata: { uploadId: string }[],
    status: PostStatus,
  ): Promise<ImagePostEntity[]> {
    const images = await this.prisma.postImage.findMany({
      where: {
        resourceId: {
          in: metadata.map(c => c.uploadId),
        },
      },
    });
    return plainToInstance(ImagePostEntity, images);
  }
  async findImagesByUploadIds(childrenMetadata: ChildMetadataDto[]): Promise<ImagePostEntity[]> {
    const images = await this.prisma.postImage.findMany({
      where: {
        resourceId: {
          in: childrenMetadata.map(c => c.uploadId),
        },
      },
    });
    return plainToInstance(ImagePostEntity, images);
  }

  //two flow
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

  //unused
  async updateImages(images: ImagePostEntity[]): Promise<void> {
    await this.prisma.$transaction(
      images.map(image =>
        this.prisma.postImage.update({
          where: { id: image.id },
          data: {
            resourceId: image.resourceId,
            postId: image.postId,
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
  }
  async deletePostById(postId: number) {
    await this.prisma.post.delete({
      where: {
        id: postId,
      },
      include: { images: true },
    });
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
}
