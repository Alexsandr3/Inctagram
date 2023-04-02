import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Login User
 */
export class LoginInputDto {
  /**
   * Login or Email  -  User
   */
  // @Trim()
  @IsNotEmpty()
  @IsString()
  email: string;
  /**
   * Password User
   */
  // @Trim()
  @IsNotEmpty()
  @IsString()
  password: string;
}
