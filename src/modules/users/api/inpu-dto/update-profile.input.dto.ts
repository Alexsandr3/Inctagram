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

  @Transform(({ value }) =>
    typeof value === 'string' ? (value.trim().length === 0 ? undefined : value.trim()) : value,
  )
  @IsOptional()
  firstName: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? (value.trim().length === 0 ? undefined : value.trim()) : value,
  )
  @IsOptional()
  lastName: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? (value.trim().length === 0 ? undefined : value.trim()) : value,
  )
  @IsOptional()
  city: string;

  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @Length(1, 200)
  @IsString()
  @IsOptional()
  aboutMe: string;
}
