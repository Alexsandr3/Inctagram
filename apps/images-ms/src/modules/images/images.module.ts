import { Module } from '@nestjs/common';
import { AwsModule } from '@images-ms/providers/aws/aws.module';
import { ImagesController } from '@images-ms/modules/images/api/images.controller';
import { ImagesEditorService } from '@images-ms/modules/images/application/images-editor.service';
import { ImagesEventHandlerService } from '@images-ms/modules/images/application/images-event-handler.service';
import { DatabaseModule } from '@common/modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageMain } from '@images-ms/modules/images/domain/image.entity';
import { IImagesRepository, ImagesRepository } from '@images-ms/modules/images/infrastructure/images.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { HandleImagesUseCase } from '@images-ms/modules/images/application/use-cases/handler-images-use.case';
import { DeleteImagesUseCase } from '@images-ms/modules/images/application/use-cases/delete-images-use.case';

const useCases = [HandleImagesUseCase, DeleteImagesUseCase];
@Module({
  imports: [AwsModule, DatabaseModule, TypeOrmModule.forFeature([ImageMain]), CqrsModule],
  controllers: [ImagesController],
  providers: [
    ...useCases,
    ImagesEditorService,
    ImagesEventHandlerService,
    {
      provide: IImagesRepository,
      useClass: ImagesRepository,
    },
  ],
  exports: [ImagesEditorService],
})
export class ImagesModule {}
