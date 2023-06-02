import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InboxStripeEventEntity } from './inbox-stripe-event.entity';

export abstract class IInboxEventRepository {
  abstract create(event: InboxStripeEventEntity): Promise<void>;
}

@Injectable()
export class InboxEventRepository implements IInboxEventRepository {
  constructor(
    @InjectRepository(InboxStripeEventEntity)
    private inboxStripeEventEntityRepository: Repository<InboxStripeEventEntity>,
  ) {}

  async create(event: InboxStripeEventEntity): Promise<void> {
    await this.inboxStripeEventEntityRepository.save(event);
  }
}
