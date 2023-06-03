import { BaseDateEntity } from '@common/main/entities/base-date.entity';
import { Renewal } from '@prisma/client';

export class RenewalEntity extends BaseDateEntity implements Renewal {
  id: number;
  dateOfRenewal: Date;
  subscriptionId: string;
}
