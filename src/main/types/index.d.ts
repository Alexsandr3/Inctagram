import { SessionDto } from '../../modules/sessions/application/dto/SessionDto';

declare global {
  declare namespace Express {
    export interface Request {
      userId: number;
      sessionData: SessionDto;
      payLoad: any;
    }
  }
}
