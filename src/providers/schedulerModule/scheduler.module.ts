import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupService } from './cleanup.service';
import { CleanupTask } from './cleanup.task';
import { CleanupRepository } from './cleanup.repository';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CleanupService, CleanupTask, CleanupRepository],
})
export class SchedulerModule {}
