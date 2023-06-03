import { ImageType } from '@common/main/entities/type/image.type';
import { IsNumber, IsString } from 'class-validator';

export class CreateImagesInputDto {
  @IsNumber()
  userId: number;
  @IsString()
  type: ImageType;
}
