import { IsString } from 'class-validator';

export class DeleteImagesInputDto {
  @IsString({ each: true })
  keys: string[];
}
