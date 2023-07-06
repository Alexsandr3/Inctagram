import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BaseParametersImageValidation } from './image-validation.type';

/**
 * @description This pipe is used to validate array modules, check the type of each image
 */
export class ValidationArrayImagePipe<T extends BaseParametersImageValidation>
  implements PipeTransform<Express.Multer.File[], Promise<Express.Multer.File[]>>
{
  constructor(private readonly options: T) {}
  async transform(images: Express.Multer.File[]): Promise<Express.Multer.File[]> {
    const { contentTypes } = this.options;
    if (images.length > 10)
      throw new BadRequestException([
        { message: `The number of files is too large, please upload the file less than 10`, field: 'file' },
      ]);
    // checking types of all files in the array
    for (const file of images) {
      //check if size of file is more than 20MB
      if (file.size > 20 * 1024 * 1024) {
        throw new BadRequestException([
          { message: `The file size is too large, please upload the file less than 20MB`, field: 'file' },
        ]);
      }
      const inputMimeType = file.mimetype.split(' ');
      if (!contentTypes.includes(inputMimeType[0])) {
        throw new BadRequestException([
          { message: `The file format is incorrect, please upload the correct file`, field: 'file' },
        ]);
      }
    }
    return images;
  }
}
