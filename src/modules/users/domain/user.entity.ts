import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailConfirmation } from './user.email-confirmation.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  email: string;
  @Column()
  passwordHash: string;
  @OneToOne(() => EmailConfirmation, e => e.user, { cascade: true, eager: true })
  emailConfirmation: EmailConfirmation;
  @Column()
  createdAt: Date;

  constructor(email: string, passwordHash: string) {
    this.email = email;
    this.passwordHash = passwordHash;
    this.emailConfirmation = new EmailConfirmation();
    this.createdAt = new Date();
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
