import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostInputDto {
  @ApiProperty({ nullable: true, required: false })
  @IsString()
  @Length(1, 500)
  @IsOptional()
  description: string;
}
