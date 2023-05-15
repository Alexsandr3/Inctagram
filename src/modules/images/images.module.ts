import { Module } from '@nestjs/common';
import { ImagesEditorService } from './application/images-editor.service';
import { AwsModule } from '../../providers/aws/aws.module';
import { ImagesEventHandlerService } from './application/images-event-handler.service';

@Module({
  imports: [AwsModule],
  providers: [ImagesEditorService, ImagesEventHandlerService],
  exports: [ImagesEditorService],
})
export class ImagesModule {}
