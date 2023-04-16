import { IsDate, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateProfileInputDto {
  @ApiProperty({ pattern: '^[a-zA-Z0-9_-]*$', example: 'string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(6, 30)
  @Matches('^[a-zA-Z0-9_-]*$')
  @IsOptional()
  userName: string;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim().length === 0 ? null : value.trim()) : value))
  @IsOptional()
  firstName: string | null;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim().length === 0 ? null : value.trim()) : value))
  @IsOptional()
  lastName: string | null;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim().length === 0 ? null : value.trim()) : value))
  @IsOptional()
  city: string | null;

  @ApiProperty({ nullable: true, required: false })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date | null;

  @ApiProperty({ nullable: true, required: false })
  @Length(1, 200)
  @IsString()
  @IsOptional()
  aboutMe: string | null;
}
