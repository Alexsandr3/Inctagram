import {
  AmqpBaseRequestInterface,
  TypeAmqpBaseRequestInterface,
} from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';

export interface AmqpBaseResponseInterface<T = unknown> extends AmqpBaseRequestInterface<T> {
  requestId: string;
  type: TypeAmqpBaseRequestInterface;
  payload: T;
  timestamp: number;
  exchange?: string;
  routingKey?: string;
  // retryCount: number;
  // retryTimestamps: number[];
  error?: {
    message: string;
    code: string;
  };
}
