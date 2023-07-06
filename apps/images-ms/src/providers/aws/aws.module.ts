import { Module } from '@nestjs/common';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { S3StorageAdapter } from './s3-storage.adapter';

@Module({
  imports: [ApiConfigModule],
  providers: [S3StorageAdapter],
  exports: [S3StorageAdapter],
})
export class AwsModule {}
