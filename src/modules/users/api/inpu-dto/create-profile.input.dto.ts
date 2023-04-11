import { IsDate, IsOptional, IsString, Length } from 'class-validator';

export class CreateProfileInputDto {
  @IsString()
  @Length(6, 30)
  userName: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsDate()
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  aboutMe: string;
}
