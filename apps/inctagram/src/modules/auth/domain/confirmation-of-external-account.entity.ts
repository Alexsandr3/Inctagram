import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { ConfirmationOfExternalAccount } from '@prisma/client';

export class ConfirmationOfExternalAccountEntity implements ConfirmationOfExternalAccount {
  providerId: string;
  confirmationCode: string;
  codeExpirationDate: Date;

  constructor(providerId: string) {
    this.providerId = providerId;
    this.confirmationCode = randomUUID();
    this.codeExpirationDate = add(new Date(), { hours: 1 });
  }

  static initCreate(providerId: string): ConfirmationOfExternalAccountEntity {
    return new ConfirmationOfExternalAccountEntity(providerId);
  }

  public updateConfirmation() {
    this.confirmationCode = randomUUID();
    this.codeExpirationDate = add(new Date(), { hours: 1 });
  }
}
