import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';

export interface AmqpBaseRequestInterface<T = unknown> {
  requestId: string;
  type: TypeAmqpBaseRequestInterface;
  payload: T;
  timestamp: number;
  exchange?: string;
  routingKey?: string;
  // retryCount: number;
  // retryTimestamps: number[];
  // error?: any;
}

export interface TypeAmqpBaseRequestInterface {
  microservice: MICROSERVICES;
  event: string;
}
