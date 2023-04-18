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

// const imageFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   callback: (error: Error, acceptFile: boolean) => void,
// ) => {
//   console.log(file.mimetype, 'file.mimetype');
//   if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) callback(null, false);
//   callback(null, true);
// };
// export const imageOptions: MulterOptions = {
//   limits: { fileSize: 5242880 },
//   fileFilter: imageFilter,
// };
