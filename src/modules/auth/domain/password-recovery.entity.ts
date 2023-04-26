import { add } from 'date-fns';
import { randomUUID } from 'crypto';

export class PasswordRecoveryEntity {
  id: number;
  recoveryCode: string;
  expirationDate: Date;
  email: string;

  constructor() {}

  static initCreate(email: string) {
    const passRecoveryEntity = new PasswordRecoveryEntity();
    passRecoveryEntity.email = email;
    passRecoveryEntity.recoveryCode = randomUUID();
    passRecoveryEntity.expirationDate = add(new Date(), { hours: 24 });
    return passRecoveryEntity;
  }
}
