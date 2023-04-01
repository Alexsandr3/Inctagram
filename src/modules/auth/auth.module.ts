import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
