import { Module } from '@nestjs/common';
import CustomLogger from './customLogger';
import LogsService from './application/logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Log from './domain/log.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Log])],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}
