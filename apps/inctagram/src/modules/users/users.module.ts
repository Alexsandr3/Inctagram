import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, PrismaUsersRepository } from './infrastructure/users.repository';
import { UploadImageAvatarUseCase } from './application/use-cases/upload-image-avatar.use-case';
import { AwsModule } from '../../../../images/src/providers/aws/aws.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IUsersQueryRepository, PrismaUsersQueryRepository } from './infrastructure/users.query-repository';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { ImagesEditorService } from '../../../../images/src/modules/images/application/images-editor.service';
import { DeleteImageAvatarUseCase } from './application/use-cases/delete-image-avatar.use-case';
import { UsersEventHandlerService } from './application/users-event-handler.service';
import { ClientModule } from '../Clients/clients.module';

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
