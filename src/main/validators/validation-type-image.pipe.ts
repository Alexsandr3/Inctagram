import { BadRequestException, PipeTransform } from '@nestjs/common';

/**
 * @description This interface is used to type image
 */
export interface ImageValidationType {
  contentTypes: string[];
}

/**
 * @description This pipe is used to validate images
 */
export class ValidationTypeImagePipe<T extends ImageValidationType>
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
