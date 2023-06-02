import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Login User with OAuth2
 */
export class OAuth2InputDto {
  /**
   * profile id from OAuth2 provider
   */
  @IsNotEmpty()
  @IsString()
  providerId: string;
}
