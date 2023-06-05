import { Module } from '@nestjs/common';
import { AwsModule } from '@images-ms/providers/aws/aws.module';
import { ImagesController } from '@images-ms/modules/images/api/images.controller';
import { ImagesEditorService } from '@images-ms/modules/images/application/images-editor.service';
import { ImagesEventHandlerService } from '@images-ms/modules/images/application/images-event-handler.service';

@Module({
  imports: [AwsModule],
  controllers: [ImagesController],
  providers: [ImagesEditorService, ImagesEventHandlerService],
  exports: [ImagesEditorService],
})
export class ImagesModule {}
