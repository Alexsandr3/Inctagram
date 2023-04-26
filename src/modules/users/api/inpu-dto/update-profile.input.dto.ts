import { IsDate, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Update profile input dto
 */
export class UpdateProfileInputDto {
  /**
   * User name
   */
  @ApiProperty({ pattern: '^[a-zA-Z0-9_-]*$', example: 'string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(6, 30)
  @Matches('^[a-zA-Z0-9_-]*$')
  @IsOptional()
  userName: string;

  /**
   * First name
   */
  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim().length === 0 ? null : value.trim()) : value))
  @IsOptional()
  firstName: string | null;

  /**
   * Last name
   */
  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim().length === 0 ? null : value.trim()) : value))
  @IsOptional()
  lastName: string | null;

  /**
   * City
   */
  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim().length === 0 ? null : value.trim()) : value))
  @IsOptional()
  city: string | null;

  /**
   * Country
   */
  @ApiProperty({ nullable: true, required: false })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date | null;

  /**
   * About me
   */
  @ApiProperty({ nullable: true, required: false })
  @Length(1, 200)
  @IsString()
  @IsOptional()
  aboutMe: string | null;
}
