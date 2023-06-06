import { CreatedSessionResponseInterface } from '@common/main/types/created-session-response-interface.type';

export class SessionViewModel implements CreatedSessionResponseInterface {
  customer: string;
  id: string;
  url: string;
}
