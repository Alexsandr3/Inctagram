import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { UserEntity } from './user.entity';

@Entity('UsersEmailConfirmation')
export class EmailConfirmation {
  @PrimaryColumn()
  userId: number;
  @Column()
  isConfirmed: boolean;
  @Column({ nullable: true })
  confirmationCode: string;
  @Column({ nullable: true })
  codeExpirationDate: Date;
  @OneToOne(() => UserEntity, u => u.emailConfirmation, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  constructor() {
    this.isConfirmed = false;
    this.confirmationCode = randomUUID();
    this.codeExpirationDate = add(new Date(), { hours: 1 });
  }
}
