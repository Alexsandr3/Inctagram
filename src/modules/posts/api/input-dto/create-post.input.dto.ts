import { ArrayMinSize, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ChildMetadataDto {
  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

export class CreatePostInputDto {
  @ApiProperty({ nullable: true, required: false })
  @MaxLength(500)
  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => ChildMetadataDto)
  @ArrayMinSize(1)
  childrenMetadata: ChildMetadataDto[];
}
