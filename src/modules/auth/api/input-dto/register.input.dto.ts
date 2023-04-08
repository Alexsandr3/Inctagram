import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RegisterInputDto {
  /**
   * userName: name for create/registration User
   */

  @ApiProperty({ pattern: '^[a-zA-Z0-9_-]*$', example: 'string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(1, 30)
  @IsString()
  @Matches('^[a-zA-Z0-9_-]*$')
  userName: string;

  /**
   * email: email for create/registration User
   */
  @ApiProperty({ pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', example: 'string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  @IsEmail()
  email: string;

  /**
   * password: password for create/registration User
   */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(6, 20)
  @IsString()
  password: string;
}
