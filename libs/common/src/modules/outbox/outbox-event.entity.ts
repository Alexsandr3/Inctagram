import { BaseDateEntity } from '@common/main/entities/base-date.entity';
import { OutBoxEvent, Prisma } from '@prisma/client';
import { OutBoxEventType } from '@common/modules/outbox/out-box-event.type';

export class OutboxEventEntity extends BaseDateEntity implements OutBoxEvent {
  id: number;
  userId: number;
  senderService: string;
  eventName: string;
  statusEvent: OutBoxEventType;
  payload: Prisma.JsonValue;
  constructor() {
    super();
  }

  static create(ownerId: number, senderService: string, eventName: string, payload: any): OutboxEventEntity {
    const event = new OutboxEventEntity();
    event.userId = ownerId;
    event.senderService = senderService;
    event.eventName = eventName;
    event.statusEvent = OutBoxEventType.PENDING_FOR_BROKER;
    event.payload = payload;
    return event;
  }

  updateStatusToSent() {
    this.statusEvent = OutBoxEventType.SENT_TO_BROKER;
  }

  updateStatusToFailed() {
    this.statusEvent = OutBoxEventType.FAILED_SEND_TO_BROKER;
  }
}
