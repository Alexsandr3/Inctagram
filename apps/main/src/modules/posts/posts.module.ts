import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { IPostsRepository, PostsRepository } from './infrastructure/posts.repository';
import { IPostsQueryRepository, PostsQueryRepository } from './infrastructure/posts-query.repository';
import { UsersModule } from '../users/users.module';
import { DeletePostUseCase } from './application/use-cases/delete-post-use.case';
import { UpdatePostUseCase } from './application/use-cases/update-post-use.case';
import { PostsService } from './application/posts.service';
import { PostsGetController } from './api/posts-get.controller';
import { CreatePostWithUploadImagesUseCase } from './application/use-cases/create-post-use.case';
import { DeleteImageExistingPostUseCase } from './application/use-cases/delete-image-post-use.case';
import { ClientModule } from '../Clients/client.module';

const useCases = [
  //---deprecated
  // UploadImagePostUseCase,
  // CreatePostUseCase,
  // DeleteImagePostUseCase,
  DeletePostUseCase,
  UpdatePostUseCase,
  CreatePostWithUploadImagesUseCase,
  DeleteImageExistingPostUseCase,
];

@Module({
  imports: [CqrsModule, UsersModule, ClientModule],
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
  exports: [IPostsRepository],
})
export class PostsModule {}
