export interface IAmqpBaseRequestInterface<T = unknown> {
  id: number;
  userId: number;
  senderService: string;
  eventName: string;
  statusEvent: IOutBoxEventType;
  payload: T;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOutBoxEventType {
  PENDING_FOR_BROKER: 'PENDING_FOR_BROKER';
  SENT_TO_BROKER: 'SENT_TO_BROKER';
  FAILED_SEND_TO_BROKER: 'FAILED_SEND_TO_BROKER';
}
