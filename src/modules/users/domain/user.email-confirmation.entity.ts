import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { User } from './user.entity';

@Entity('UsersEmailConfirmation')
export class EmailConfirmation {
  @Column()
  isConfirmed: boolean;
  @Column({ nullable: true })
  confirmationCode: string;
  @Column({ nullable: true })
  codeExpirationDate: Date;
  @OneToOne(() => User, u => u.emailConfirmation, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  userId: number;

  constructor() {
    this.isConfirmed = false;
    this.confirmationCode = randomUUID();
    this.codeExpirationDate = add(new Date(), { hours: 1 });
  }
}
