import { Body, Controller, Delete, HttpCode, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidationArrayImagePipe } from '@common/main/validators/validation-array-image.pipe';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { ImagesEditorService } from '@images-ms/modules/images/application/images-editor.service';
import { typeImagePost } from '@common/main/config-for-validate-images/default-options-for-validate-images-post';
import { CreateImagesInputDto } from '@images-ms/modules/images/api/input-dto/create-images.input.dto';
import { DeleteImagesInputDto } from '@images-ms/modules/images/api/input-dto/delete-images.input.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  SwaggerDecoratorsByDeleteImagesByUrls,
  SwaggerDecoratorsByFormDataForArrayFileWith,
  SwaggerDecoratorsByUploadImages,
} from '@images-ms/modules/images/swagger/swagger.images.decorators';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/main/validators/result-notification';
import { HandleImagesCommand } from '@images-ms/modules/images/application/use-cases/handler-images-use.case';
import { DeleteImagesCommand } from '@images-ms/modules/images/application/use-cases/delete-images-use.case';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private readonly commandBus: CommandBus,

    private readonly imagesEditorService: ImagesEditorService,
  ) {}

  @SwaggerDecoratorsByUploadImages()
  @SwaggerDecoratorsByFormDataForArrayFileWith()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  @UseInterceptors(FilesInterceptor('files'))
  async createImages(
    @UploadedFiles(new ValidationArrayImagePipe(typeImagePost))
    files: Express.Multer.File[],
    @Body() input: CreateImagesInputDto,
  ): Promise<BaseImageEntity[]> {
    const notification = await this.commandBus.execute<HandleImagesCommand, ResultNotification<BaseImageEntity[]>>(
      new HandleImagesCommand(input, files),
    );
    return notification.getData();
  }

  @SwaggerDecoratorsByDeleteImagesByUrls()
  @Delete()
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deleteImages(@Body() input: DeleteImagesInputDto): Promise<void> {
    await this.commandBus.execute<DeleteImagesCommand, ResultNotification<void>>(new DeleteImagesCommand(input.keys));
  }
}
