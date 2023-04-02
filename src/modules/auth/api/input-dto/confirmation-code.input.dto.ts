import { IsString, Length } from 'class-validator';

/**
 * DTO for confirmation code
 */
export class ConfirmationCodeInputDto {
  /**
   * Code that be sent via Email inside link
   */
  // @Trim()
  @Length(1, 100)
  @IsString()
  code: string;
}
