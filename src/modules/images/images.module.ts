import { Module } from '@nestjs/common';
import { ImagesEditorService } from './application/images-editor.service';
import { AwsModule } from '../../providers/aws/aws.module';
import { ImagesMapperServiceForView } from './images-mapper-for-view.service';

@Module({
  imports: [AwsModule],
  providers: [ImagesEditorService, ImagesMapperServiceForView],
  exports: [ImagesEditorService, ImagesMapperServiceForView],
})
export class ImagesModule {}
