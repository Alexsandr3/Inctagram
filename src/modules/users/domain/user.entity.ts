import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailConfirmation } from './user.email-confirmation.entity';

// @Entity('Users')
export class UserEntity {
  // @PrimaryGeneratedColumn('increment')
  id: number;
  // @Column({ unique: true })
  userName: string;
  // @Column({ unique: true })
  email: string;
  // @Column()
  passwordHash: string;
  // @OneToOne(() => EmailConfirmation, e => e.user, { cascade: true, eager: true })
  emailConfirmation: EmailConfirmation;
  // @Column()
  createdAt: Date;

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
}
