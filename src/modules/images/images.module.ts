import { Module } from '@nestjs/common';
import { ImagesEditorService } from './application/images-editor.service';
import { AwsModule } from '../../providers/aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [ImagesEditorService],
  exports: [ImagesEditorService],
})
export class ImagesModule {}
