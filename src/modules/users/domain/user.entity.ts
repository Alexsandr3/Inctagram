import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailConfirmation } from './user.email-confirmation.entity';
import { SessionEntity } from '../../sessions/domain/session.entity';
import { ProfileEntity } from './profile.entity';

export class UserEntity {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmation;
  session: SessionEntity[];
  profile: ProfileEntity;

  constructor() {}

  static initCreateUser(userName: string, email: string, passwordHash: string) {
    const instanceUser = new UserEntity();
    instanceUser.userName = userName;
    instanceUser.email = email;
    instanceUser.passwordHash = passwordHash;
    instanceUser.emailConfirmation = new EmailConfirmation();
    instanceUser.createdAt = new Date();
    return instanceUser;
  }
  static preparationUser(user: any) {
    const instanceUser = new UserEntity();
    instanceUser.id = user.id;
    instanceUser.userName = user.userName;
    instanceUser.email = user.email;
    instanceUser.passwordHash = user.passwordHash;
    instanceUser.emailConfirmation = user.emailConfirmation;
    instanceUser.createdAt = user.createdAt;
    return instanceUser;
  }

  public confirmUser() {
    this.emailConfirmation.isConfirmed = true;
  }

  public updateEmailConfirmation() {
    this.emailConfirmation.confirmationCode = randomUUID();
    this.emailConfirmation.codeExpirationDate = add(new Date(), { hours: 1 });
  }

  public updatePassword(passwordHash: string) {
    this.passwordHash = passwordHash;
  }

  isUserNameUnique(userName: string) {
    return this.userName === userName;
  }
}
