import { PrismaService } from '../../../providers/prisma/prisma.service';
import { PostEntity, PostStatus } from '../domain/post.entity';
import { plainToInstance } from 'class-transformer';
import { PostViewModel } from '../api/view-models/post-view.dto';
import { Injectable } from '@nestjs/common';
import { PaginationPostsInputDto } from '../api/input-dto/pagination-posts.input.dto';
import { PostsWithPaginationViewDto } from '../api/view-models/posts-with-pagination-view.dto';
import { Paginated } from '../../../main/shared/paginated';
import { UserStatus } from '@prisma/client';

export abstract class IPostsQueryRepository {
  abstract getPost(postId: number, status: PostStatus): Promise<PostViewModel>;
  abstract getPosts(userId: number, paginationInputModel: PaginationPostsInputDto): Promise<Paginated<PostViewModel[]>>;
  //unused
  /* abstract getUploadImages(resourceId: string): Promise<UploadedImageViewModel>;*/
}

@Injectable()
export class PostsQueryRepository implements IPostsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPost(postId: number, status: PostStatus): Promise<PostViewModel> {
    //find post where id = postId and status = status and user status not equal to deleted and not equal to banned
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
        status,
        user: {
          status: {
            notIn: [UserStatus.DELETED, UserStatus.BANNED],
          },
        },
      },
      include: {
        images: { where: { status: 'PUBLISHED' }, orderBy: { id: 'asc' } },
      },
    });
    if (!foundPost) return null;

    const post = plainToInstance(PostEntity, foundPost);
    post.images.sort((a, b) => b.width - a.width);
    return new PostViewModel(post);
  }
  async getPosts(userId: number, paginationInputModel: PaginationPostsInputDto): Promise<Paginated<PostViewModel[]>> {
    const posts = await this.prisma.post.findMany({
      where: {
        ownerId: userId,
        status: PostStatus.PUBLISHED,
        user: {
          status: {
            notIn: [UserStatus.DELETED, UserStatus.BANNED],
          },
        },
      },
      orderBy: {
        createdAt: paginationInputModel.isSortDirection(),
      },
      skip: paginationInputModel.skip, //(page - 1) * limit,
      take: paginationInputModel.getPageSize(), //limit
      include: {
        images: { where: { status: 'PUBLISHED' }, orderBy: { id: 'asc' } },
      },
    });
    const total = await this.prisma.post.count({
      where: {
        ownerId: userId,
        status: PostStatus.PUBLISHED,
        user: {
          status: {
            notIn: [UserStatus.DELETED, UserStatus.BANNED],
          },
        },
      },
    });
    return PostsWithPaginationViewDto.getPaginated({
      items: posts.map(post => new PostViewModel(plainToInstance(PostEntity, post))),
      page: paginationInputModel.getPageNumber(),
      size: paginationInputModel.getPageSize(),
      count: total,
    });
  }
}

//unused
/* async getUploadImages(resourceId: string): Promise<UploadedImageViewModel> {
  const images = await this.prisma.postImage.findMany({
    where: {
      resourceId,
      status: PostStatus.PUBLISHED,
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
}*/
