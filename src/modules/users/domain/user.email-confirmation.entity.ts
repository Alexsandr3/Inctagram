import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class EmailConfirmationEntity {
  userId: number;
  isConfirmed: boolean;
  confirmationCode: string;
  codeExpirationDate: Date;

  constructor() {
    this.isConfirmed = false;
    this.confirmationCode = randomUUID();
    this.codeExpirationDate = add(new Date(), { hours: 1 });
  }

  static initCreate(): EmailConfirmationEntity {
    return new EmailConfirmationEntity();
  }
}
