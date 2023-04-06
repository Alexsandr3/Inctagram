import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Input data for check password recovery code
 */
export class PasswordRecoveryCodeInputDto {
  /**
   * Code that be sent via Email inside link
   */
  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
