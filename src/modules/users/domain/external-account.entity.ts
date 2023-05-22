import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { ExternalAccount } from '@prisma/client';
import { RegisterUserFromExternalAccountInputDto } from '../../auth/api/input-dto/register-user-from-external-account-input.dto';
import { ConfirmationOfExternalAccountEntity } from '../../auth/domain/confirmation-of-external-account.entity';

export enum Provider {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export class ExternalAccountEntity extends BaseDateEntity implements ExternalAccount {
  id: number;
  userId: number;
  provider: Provider;
  providerId: string;
  displayName: string | null;
  email: string;
  isConfirmed: boolean;

  static initCreate(dto: RegisterUserFromExternalAccountInputDto): ExternalAccountEntity {
    const instanceExternalAccount = new ExternalAccountEntity();
    instanceExternalAccount.provider = dto.provider;
    instanceExternalAccount.providerId = dto.providerId;
    instanceExternalAccount.displayName = dto.displayName;
    instanceExternalAccount.email = dto.email.toLowerCase();
    instanceExternalAccount.isConfirmed = false;
    return instanceExternalAccount;
  }

  static createConfirmedExternalAccount(dto: RegisterUserFromExternalAccountInputDto): ExternalAccountEntity {
    const instanceExternalAccount = this.initCreate(dto);
    instanceExternalAccount.isConfirmed = true;
    return instanceExternalAccount;
  }

  confirmAccount() {
    this.isConfirmed = true;
  }

  validateConfirmationCodeAndStatus(
    foundConfirmationOfExternalAccount: ConfirmationOfExternalAccountEntity,
    confirmationCode: string,
  ): boolean {
    return (
      this.isConfirmed ||
      foundConfirmationOfExternalAccount.codeExpirationDate < new Date() ||
      foundConfirmationOfExternalAccount.confirmationCode !== confirmationCode
    );
  }
}
