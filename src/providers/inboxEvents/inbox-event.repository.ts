import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export abstract class IInboxEventRepository {
  abstract create(event: any): Promise<void>;
}

@Injectable()
export class InboxEventRepository implements IInboxEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(event: any): Promise<void> {
    await this.prisma.inboxPaymentEvent.create({
      data: {
        payload: event,
      },
    });
  }
}
