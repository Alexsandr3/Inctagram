import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Login User
 */
export class LoginInputDto {
  /**
   * Login or Email  -  User
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
  /**
   * Password User
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}
