import { ImagesEditorService } from '../application/images-editor.service';
import { CreateImagesInputDto } from './input-dto/create-images.input.dto';
import { Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidationArrayImagePipe } from '@common/main/validators/validation-array-image.pipe';
import { typeImagePost } from '../../../../../inctagram/src/modules/posts/default-options-for-validate-images-post';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { DeleteImagesInputDto } from './input-dto/delete-images.input.dto';

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
