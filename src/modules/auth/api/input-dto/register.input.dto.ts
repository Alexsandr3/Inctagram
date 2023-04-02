import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterInputDto {
  /**
   * password: password for create/registration User
   */
  // @Trim()
  @Length(6, 20)
  @IsString()
  password: string;
  /**
   * email: email for create/registration User
   */
  @ApiProperty({ pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', example: 'string' })
  // @Trim()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
