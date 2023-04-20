import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadImagePostUseCase } from './application/use-cases/upload-image-post-use.case';
import { CreatePostUseCase } from './application/use-cases/create-post-use.case';
import { IPostsRepository, PostsRepository } from './infrastructure/posts.repository';
import { IPostsQueryRepository, PostsQueryRepository } from './infrastructure/posts-query.repository';
import { ImagesModule } from '../images/images.module';
import { UsersModule } from '../users/users.module';
import { DeleteImagePostUseCase } from './application/use-cases/delete-image-post-use.case';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { DeletePostUseCase } from './application/use-cases/delete-post-use.case';
import { UpdatePostUseCase } from './application/use-cases/update-post-use.case';
import { PostsService } from './application/posts.service';
import { PostsGetController } from './api/posts-get.controller';

const useCases = [
  UploadImagePostUseCase,
  CreatePostUseCase,
  DeleteImagePostUseCase,
  DeletePostUseCase,
  UpdatePostUseCase,
];

@Module({
  imports: [CqrsModule, ImagesModule, UsersModule, PrismaModule],
  controllers: [PostsController, PostsGetController],
  providers: [
    PostsService,
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
