import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, PrismaUsersRepository } from './infrastructure/users.repository';
import { UploadImageAvatarUseCase } from './aplication/use-cases/upload-image-avatar.use-case';
import { AwsModule } from '../../providers/aws/aws.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProfileUseCase } from './aplication/use-cases/create-profile.use-case';
import { IProfilesRepository, PrismaProfilesRepository } from './infrastructure/profiles.repository';
import { IUsersQueryRepository, PrismaUsersQueryRepository } from "./infrastructure/users.query-repository";

// const entities = [UserEntity, EmailConfirmation];

const useCases = [UploadImageAvatarUseCase, CreateProfileUseCase];

@Module({
  imports: [
    AwsModule,
    CqrsModule,
    // TypeOrmModule.forFeature(entities)
  ],
  controllers: [UsersController],
  providers: [
    ...useCases,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: IProfilesRepository,
      useClass: PrismaProfilesRepository,
    },
    {
      provide: IUsersQueryRepository,
      useClass: PrismaUsersQueryRepository,
    },
  ],
  exports: [IUsersRepository, IUsersQueryRepository],
})
export class UsersModule {}
