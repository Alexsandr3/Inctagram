import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { PostEntity } from '../domain/post.entity';
import { ChildMetadataDto } from '../api/input-dto/create-post.input.dto';

export abstract class IPostsRepository {
  abstract newPost(userId: number): Promise<PostEntity>;
  abstract savePost(post: PostEntity): Promise<void>;
  abstract findPostByOwnerIdAndStatus(userId: number);
  abstract findPostByOwnerIdAndUploadIds(userId: number, childrenMetadata: ChildMetadataDto[]): Promise<PostEntity>;
}

export class PostsRepository implements IPostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async newPost(userId: number): Promise<PostEntity> {
    const post = await this.prisma.post.create({
      data: {
        ownerId: userId,
      },
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
              postId: i.id,
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
  async findPostByOwnerIdAndStatus(userId: number) {
    const post = await this.prisma.post.findFirst({
      where: {
        ownerId: userId,
        status: 'PENDING',
      },
      include: { images: true },
    });
    return plainToInstance(PostEntity, post);
  }

  async findPostByOwnerIdAndUploadIds(userId: number, childrenMetadata: ChildMetadataDto[]): Promise<PostEntity> {
    const post = await this.prisma.post.findFirst({
      where: {
        ownerId: userId,
        status: 'PENDING',
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
