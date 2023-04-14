import { add } from 'date-fns';
import { randomUUID } from 'crypto';

export class PasswordRecoveryEntity {
  id: number;
  recoveryCode: string;
  expirationDate: Date;
  email: string;

  constructor() {}

  static preparation(passRecovery: any): PasswordRecoveryEntity {
    const passRecoveryEntity = new PasswordRecoveryEntity();
    passRecoveryEntity.id = passRecovery.id;
    passRecoveryEntity.email = passRecovery.email;
    passRecoveryEntity.recoveryCode = passRecovery.recoveryCode;
    passRecoveryEntity.expirationDate = passRecovery.expirationDate;
    return passRecoveryEntity;
  }

  static initCreate(email: string) {
    const passRecoveryEntity = new PasswordRecoveryEntity();
    passRecoveryEntity.email = email;
    passRecoveryEntity.recoveryCode = randomUUID();
    passRecoveryEntity.expirationDate = add(new Date(), { hours: 24 });
    return passRecoveryEntity;
  }
}
