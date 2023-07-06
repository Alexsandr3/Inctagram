import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Stripe from 'stripe';

@Entity()
export class InboxStripeEventEntity {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  type: string;
  @Column({ type: 'varchar' })
  eventId: string;
  @Column({ type: 'jsonb' })
  public context: Stripe.Event;
  @CreateDateColumn()
  createdAt: Date;
  constructor() {}
  static create(type: string, context: Stripe.Event) {
    const event = new InboxStripeEventEntity();
    event.type = type;
    event.eventId = context.id;
    event.context = context;
    return event;
  }
}
