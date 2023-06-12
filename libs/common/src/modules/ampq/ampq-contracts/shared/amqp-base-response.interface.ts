import {
  IAmqpBaseRequestInterface,
  IOutBoxEventType,
} from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';

export interface IAmqpBaseResponseInterface<T = unknown> extends IAmqpBaseRequestInterface<T> {
  id: number;
  userId: number;
  senderService: string;
  eventName: string;
  statusEvent: IOutBoxEventType;
  payload: T;
  createdAt: Date;
  updatedAt: Date;
  error?: {
    message: string;
    code: string;
  };
}
