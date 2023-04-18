import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadImagePostUseCase } from './aplication/upload-image-post-use.case';
import { CreatePostUseCase } from './aplication/create-post-use.case';
import { IPostsRepository, PostsRepository } from './infrastructure/posts.repository';
import { IPostsQueryRepository, PostsQueryRepository } from './infrastructure/posts-query.repository';
import { ImagesModule } from '../images/images.module';
import { UsersModule } from '../users/users.module';
import { DeleteImagePostUseCase } from './aplication/delete-image-post-use.case';

const useCases = [UploadImagePostUseCase, CreatePostUseCase, DeleteImagePostUseCase];

@Module({
  imports: [CqrsModule, ImagesModule, UsersModule],
  controllers: [PostsController],
  providers: [
    ...useCases,
    {
      provide: IPostsRepository,
      useClass: PostsRepository,
    },
    {
      provide: IPostsQueryRepository,
      useClass: PostsQueryRepository,
    },
  ],
})
export class PostsModule {}
