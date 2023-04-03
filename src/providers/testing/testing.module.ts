import { Module } from '@nestjs/common';
import { TestingController } from './testins.controller';
import { TestingService } from './testing.service';

/**
 * Module for testing purposes
 */
@Module({
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
