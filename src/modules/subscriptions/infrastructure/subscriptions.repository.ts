import { BusinessAccountEntity } from '../domain/business-account.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

export abstract class ISubscriptionsRepository {
  abstract findBusinessAccountByUserId(userId: number): Promise<BusinessAccountEntity>;
}

@Injectable()
export class SubscriptionsRepository implements ISubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findBusinessAccountByUserId(userId: number): Promise<BusinessAccountEntity> {
    const businessAccount = await this.prisma.businessAccount.findFirst({ where: { userId } });
    return plainToInstance(BusinessAccountEntity, businessAccount);
  }
}
