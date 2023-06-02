import { IsDate, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Update profile input dto
 */
export class UpdateProfileInputDto {
  /**
   * User name [6, 30]
   */
  @ApiProperty({ pattern: '^[a-zA-Z0-9_-]*$', example: 'string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(6, 30)
  @Matches('^[a-zA-Z0-9_-]*$', undefined, {
    message: 'The username should contain only latin letters, numbers and the following characters: "-" and "_"',
  })
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
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim() ? value.trim() : null) : value))
  @MaxLength(200)
  @IsString()
  @IsOptional()
  aboutMe: string | null;
}
