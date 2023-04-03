import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Login User
 */
export class LoginInputDto {
  /**
   * Email  -  User
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
