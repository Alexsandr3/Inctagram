import { IsString } from 'class-validator';

/**
 * DTO for confirmation code
 */
export class ConfirmationCodeInputDto {
  /**
   * Code that be sent via Email inside link
   */
  @IsString()
  code: string;
}
