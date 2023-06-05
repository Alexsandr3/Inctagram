import { SessionDto } from '../../modules/sessions/application/dto/SessionDto';
import { PaymentInputData } from '../../../../payments-ms/src/main/decorators/signature-data.decorator';

declare global {
  declare namespace Express {
    export interface Request {
      userId: number;
      sessionData: SessionDto;
      payLoad: any;
      paymentData: PaymentInputData;
    }
  }
}
