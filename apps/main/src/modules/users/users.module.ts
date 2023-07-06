import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, PrismaUsersRepository } from './infrastructure/users.repository';
import { UploadImageAvatarUseCase } from './application/use-cases/upload-image-avatar.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { IUsersQueryRepository, PrismaUsersQueryRepository } from './infrastructure/users.query-repository';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { DeleteImageAvatarUseCase } from './application/use-cases/delete-image-avatar.use-case';
import { UsersEventHandlerService } from './application/users-event-handler.service';
import { ClientModule } from '../Clients/client.module';
import { AwsModule } from '@images-ms/providers/aws/aws.module';
import { ImagesEditorService } from '@images-ms/modules/images/application/images-editor.service';

const useCases = [UploadImageAvatarUseCase, UpdateProfileUseCase, DeleteImageAvatarUseCase];

@Module({
  imports: [AwsModule, CqrsModule, ClientModule],
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
