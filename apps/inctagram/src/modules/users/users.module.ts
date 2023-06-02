import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, PrismaUsersRepository } from './infrastructure/users.repository';
import { UploadImageAvatarUseCase } from './application/use-cases/upload-image-avatar.use-case';
import { AwsModule } from '../../providers/aws/aws.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IUsersQueryRepository, PrismaUsersQueryRepository } from './infrastructure/users.query-repository';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { ImagesEditorService } from '../images/application/images-editor.service';
import { ImagesModule } from '../images/images.module';
import { DeleteImageAvatarUseCase } from './application/use-cases/delete-image-avatar.use-case';
import { UsersEventHandlerService } from './application/users-event-handler.service';

const useCases = [UploadImageAvatarUseCase, UpdateProfileUseCase, DeleteImageAvatarUseCase];

@Module({
  imports: [AwsModule, CqrsModule, ImagesModule],
  controllers: [UsersController],
  providers: [
    ...useCases,
    UsersEventHandlerService,
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
