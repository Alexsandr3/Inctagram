import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class EmailConfirmationEntity {
  userId: number;
  confirmationCode: string;
  codeExpirationDate: Date;

  constructor() {
    this.confirmationCode = randomUUID();
    this.codeExpirationDate = add(new Date(), { hours: 1 });
  }

  static initCreate(): EmailConfirmationEntity {
    return new EmailConfirmationEntity();
  }

  public updateEmailConfirmation() {
    this.confirmationCode = randomUUID();
    this.codeExpirationDate = add(new Date(), { hours: 1 });
  }
}
