import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, PrismaUsersRepository } from './infrastructure/users.repository';
//import { UserEntity } from './domain/user.entity';
//import { EmailConfirmation } from './domain/user.email-confirmation.entity';
import { IUsersQueryRepository, PrismaUsersQueryRepository } from './infrastructure/users.query-repository';

//const entities = [UserEntity, EmailConfirmation];

@Module({
  imports: [
    // TypeOrmModule.forFeature(entities)
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: IUsersQueryRepository,
      useClass: PrismaUsersQueryRepository,
    },
  ],
  exports: [IUsersRepository, IUsersQueryRepository],
})
export class UsersModule {}
