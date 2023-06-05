import { BadRequestException, PipeTransform } from '@nestjs/common';
import sharp, { Metadata } from 'sharp';
import { ParametersImageValidation } from '@common/main/validators/parameters-image.validation';

/**
 * @description This pipe is used to validate modules
 */
export class ValidationParamsImagePipe<T extends ParametersImageValidation>
  implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
  constructor(private readonly options: T) {}
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    const { defaultSize, contentTypes, defaultWidth, defaultHeight } = this.options;
    //checking type
    const inputMimeType = image.mimetype.split(' ');

    if (image.size > defaultSize || !contentTypes.includes(inputMimeType[0])) {
      throw new BadRequestException([
        { message: `The file format is incorrect, please upload the correct file`, field: 'file' },
      ]);
    }
    //checking "width" and "height
    const metadata: Metadata = await sharp(image.buffer).metadata();
    if (metadata.width > defaultWidth || metadata.height > defaultHeight) {
      throw new BadRequestException([
        { message: `The file format is incorrect, please upload the correct file`, field: 'file' },
      ]);
    }
    return image;
  }
}
