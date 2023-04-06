import { IsString, Length } from 'class-validator';

/**
 * DTO for confirmation code
 */
export class ConfirmationCodeInputDto {
  /**
   * Code that be sent via Email inside link
   */
  @IsString()
  @Length(1, 100)
  confirmationCode: string;
}
