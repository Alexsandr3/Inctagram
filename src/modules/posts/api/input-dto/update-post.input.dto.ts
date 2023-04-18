import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostInputDto {
  @ApiProperty({ nullable: true, required: true })
  @MaxLength(500)
  @IsString()
  description: string;
}
