import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BaseParametersImageValidation } from './image-validation.type';

/**
 * @description This pipe is used to validate images
 */
export class ValidationImagePipe<T extends BaseParametersImageValidation>
  implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
  constructor(private readonly options: T) {}
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    const { contentTypes } = this.options;
    //checking type
    const inputMimeType = image.mimetype.split(' ');
    if (!contentTypes.includes(inputMimeType[0])) {
      throw new BadRequestException([
        { message: `The file format is incorrect, please upload the correct file`, field: 'file' },
      ]);
    }
    return image;
  }
}
