import { Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidationArrayImagePipe } from '@common/main/validators/validation-array-image.pipe';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { ImagesEditorService } from '@images-ms/modules/images/application/images-editor.service';
import { typeImagePost } from '@common/main/config-for-validate-images/default-options-for-validate-images-post';
import { CreateImagesInputDto } from '@images-ms/modules/images/api/input-dto/create-images.input.dto';
import { DeleteImagesInputDto } from '@images-ms/modules/images/api/input-dto/delete-images.input.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesEditorService: ImagesEditorService) {}
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createImages(
    @UploadedFiles(new ValidationArrayImagePipe(typeImagePost))
    files: Express.Multer.File[],
    @Body() input: CreateImagesInputDto,
  ): Promise<BaseImageEntity[]> {
    return this.imagesEditorService.generateAndSaveImages(input.userId, files, input.type);
  }
  @Delete()
  async deleteImages(@Body() input: DeleteImagesInputDto) {
    return this.imagesEditorService.deleteImageByUrl(input.keys);
  }
}
