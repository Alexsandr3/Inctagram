import { PrismaService } from '../../../providers/prisma/prisma.service';
import { PostImageViewModel } from '../api/view-models/post-image-view.dto';
import { PostEntity, PostStatus } from '../domain/post.entity';
import { plainToInstance } from 'class-transformer';
import { PostViewModel } from '../api/view-models/post-view.dto';
import { Injectable } from '@nestjs/common';

export abstract class IPostsQueryRepository {
  abstract getPost(postId: number, status: PostStatus): Promise<PostViewModel>;
  abstract getUploadImages(fieldId: string): Promise<PostImageViewModel>;
}

@Injectable()
export class PostsQueryRepository implements IPostsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPost(postId: number, status: PostStatus): Promise<PostViewModel> {
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
        status,
      },
      include: {
        images: { where: { status: 'PUBLISHED' } },
      },
    });
    if (!foundPost) return null;

    const post = plainToInstance(PostEntity, foundPost);
    post.images.sort((a, b) => b.width - a.width);
    return new PostViewModel(post);
  }

  async getUploadImages(fieldId: string): Promise<PostImageViewModel> {
    const images = await this.prisma.postImage.findMany({
      where: {
        fieldId: fieldId,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new PostImageViewModel(images[0].url, images[0].width, images[0].height, images[0].fileSize, images[0].id);
  }
}
