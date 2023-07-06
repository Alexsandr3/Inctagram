import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';
import { OutBoxEventType } from '@common/modules/outbox/out-box-event.type';
import { Prisma } from '@prisma/client';

@Entity()
export class OutboxEventPaymentsEntity extends OutboxEventEntity {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn('increment')
  id: number;
  userId: number;
  service: string;
  eventName: string;
  statusEvent: OutBoxEventType;
  payload: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}
