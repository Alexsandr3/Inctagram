import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Update post input dto
 */
export class UpdatePostInputDto {
  /**
   * @description Post description (optional) -- max length 500
   */
  @ApiProperty({ nullable: true, required: true })
  @MaxLength(500)
  @IsString()
  description: string;
}
