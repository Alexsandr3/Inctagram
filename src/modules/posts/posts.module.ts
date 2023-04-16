import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadImagePostUseCase } from './aplication/upload-image-post-use.case';
import { CreatePostUseCase } from './aplication/create-post-use.case';

const useCases = [UploadImagePostUseCase, CreatePostUseCase];

@Module({
  imports: [CqrsModule],
  controllers: [PostsController],
  providers: [...useCases],
})
export class PostsModule {}
