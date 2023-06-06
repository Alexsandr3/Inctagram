import { CreatedSessionResponseInterface } from '@common/modules/ampq/ampq-contracts/queues/images/payments.contract';

export class SessionViewModel implements CreatedSessionResponseInterface {
  customer: string;
  id: string;
  url: string;
}
