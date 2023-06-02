import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Input data for new password.
 */
export class NewPasswordInputDto {
  /**
   * New account recovery password.
   */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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
