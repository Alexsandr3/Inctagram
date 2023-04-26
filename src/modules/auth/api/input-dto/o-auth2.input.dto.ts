import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Login User with OAuth2
 */
export class OAuth2InputDto {
  /**
   * Email  -  User
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
