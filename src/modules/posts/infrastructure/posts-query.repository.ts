import { PrismaService } from '../../../providers/prisma/prisma.service';
import { PostImageViewModel } from '../api/view-models/post-image-view.dto';
import { PostEntity, PostStatus } from '../domain/post.entity';
import { plainToInstance } from 'class-transformer';
import { PostViewModel } from '../api/view-models/post-view.dto';
import { Injectable } from '@nestjs/common';
import { UploadedImageViewModel } from '../api/view-models/uploaded-image-view.dto';

export abstract class IPostsQueryRepository {
  abstract getPost(postId: number, status: PostStatus): Promise<PostViewModel>;
  abstract getUploadImages(data: { fieldId: string }[]): Promise<UploadedImageViewModel>;
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

  async getUploadImages(data: { fieldId: string }[]): Promise<UploadedImageViewModel> {
    const images = await this.prisma.postImage.findMany({
      where: {
        fieldId: {
          in: data.map(item => item.fieldId),
        },
        status: PostStatus.PENDING,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return new UploadedImageViewModel(
      images.map(
        image => new PostImageViewModel(image.url, image.width, image.height, image.fileSize, image.resourceId),
      ),
    );
  }
}
