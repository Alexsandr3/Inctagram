import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * Input data for new password.
 */
export class NewPasswordInputDto {
  /**
   * New account recovery password.
   */
  // @Trim()
  @Length(6, 20)
  @IsString()
  newPassword: string;
  /**
   * Code that be sent via Email inside link
   */
  // @Trim()
  @IsNotEmpty()
  @IsString()
  recoveryCode: string;
}
