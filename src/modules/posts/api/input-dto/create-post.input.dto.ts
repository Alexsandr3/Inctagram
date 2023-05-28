import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Create post input dto
 */
export class CreatePostInputDto {
  /**
   * @description Post description (optional) -- max length 500
   */
  @ApiProperty({ nullable: true, required: false })
  @MaxLength(500)
  @IsString()
  @IsOptional()
  description: string;
}

//deprecated
/*

/!**
 * @description Child metadata dto
 *!/
export class ChildMetadataDto {
  /!**
   * @description Image upload id
   *!/
  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

/!**
 * @description Create post input dto
 *!/
export class CreatePostInputDto {
  /!**
   * @description Post description (optional)
   *!/
  @ApiProperty({ nullable: true, required: false })
  @MaxLength(500)
  @IsString()
  description: string;

  /!**
   * @description Post children metadata
   *!/
  @ValidateNested({ each: true })
  @Type(() => ChildMetadataDto)
  @ArrayMinSize(1)
  childrenMetadata: ChildMetadataDto[];
}
*/
