import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Email Recovery DTO
 */
export class PasswordRecoveryInputDto {
  /**
   * Email User for recovery
   */
  // @Trim()
  @IsString()
  @IsEmail()
  @ApiProperty({
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    example: 'string',
  })
  email: string;
}
