import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ChildMetadataDto {
  @IsNumber()
  @IsNotEmpty()
  uploadId: number;
}

export class CreatePostInputDto {
  @ApiProperty({ nullable: true, required: false })
  @IsString()
  @Length(1, 500)
  @IsOptional()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => ChildMetadataDto)
  @ArrayMinSize(1)
  childrenMetadata: ChildMetadataDto[];
}
