import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, PrismaUsersRepository } from './infrastructure/users.repository';
import { UploadImageAvatarUseCase } from './aplication/use-cases/upload-image-avatar.use-case';
import { AwsModule } from '../../providers/aws/aws.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IUsersQueryRepository, PrismaUsersQueryRepository } from './infrastructure/users.query-repository';
import { UpdateProfileUseCase } from './aplication/use-cases/update-profile.use-case';
import { ImagesEditorService } from '../images/application/images-editor.service';
import { ImagesModule } from '../images/images.module';
import { DeleteImageAvatarUseCase } from './aplication/use-cases/delete-image-avatar.use-case';

const useCases = [UploadImageAvatarUseCase, UpdateProfileUseCase, DeleteImageAvatarUseCase];

@Module({
  imports: [AwsModule, CqrsModule, ImagesModule],
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
