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
  @Transform(({ value }) =>
    typeof value === 'string' ? (value.trim().length === 0 ? undefined : value.trim()) : value,
  )
  @IsOptional()
  firstName: string;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) =>
    typeof value === 'string' ? (value.trim().length === 0 ? undefined : value.trim()) : value,
  )
  @IsOptional()
  lastName: string;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) =>
    typeof value === 'string' ? (value.trim().length === 0 ? undefined : value.trim()) : value,
  )
  @IsOptional()
  city: string;

  @ApiProperty({ nullable: true, required: false })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @ApiProperty({ nullable: true, required: false })
  @Length(1, 200)
  @IsString()
  @IsOptional()
  aboutMe: string;
}
