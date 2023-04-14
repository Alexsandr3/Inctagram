import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, PrismaUsersRepository } from './infrastructure/users.repository';
import { UploadImageAvatarUseCase } from './aplication/use-cases/upload-image-avatar.use-case';
import { AwsModule } from '../../providers/aws/aws.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IUsersQueryRepository, PrismaUsersQueryRepository } from './infrastructure/users.query-repository';
import { UpdateProfileUseCase } from './aplication/use-cases/update-profile.use-case';
import { ImagesEditorService } from '../images-editor/images-editor.service';
import { ImagesEditorModule } from '../images-editor/images-editor.module';

const useCases = [UploadImageAvatarUseCase, UpdateProfileUseCase];

@Module({
  imports: [AwsModule, CqrsModule, ImagesEditorModule],
  controllers: [UsersController],
  providers: [
    ...useCases,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: IUsersQueryRepository,
      useClass: PrismaUsersQueryRepository,
    },
    ImagesEditorService,
  ],
  exports: [IUsersRepository, IUsersQueryRepository],
})
export class UsersModule {}
