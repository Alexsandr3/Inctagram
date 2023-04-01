import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
