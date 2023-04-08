import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { IUsersRepository, UsersRepository } from './infrastructure/users.repository';
import { User } from './domain/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmation } from './domain/user.email-confirmation.entity';

const entities = [User, EmailConfirmation];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [UsersController],
  providers: [
    {
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
  ],
  exports: [IUsersRepository],
})
export class UsersModule {}
