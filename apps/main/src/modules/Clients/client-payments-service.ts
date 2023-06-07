import { Injectable } from '@nestjs/common';
import { ClientPaymentsAdapter } from './client-payments-adapter';
import { CreateSessionRequestInterface } from '@common/main/types/create-session-interface.type';

@Injectable()
export class ClientPaymentsService {
  constructor(private readonly clientAdapter: ClientPaymentsAdapter) {}

  async createSession<T>(data: CreateSessionRequestInterface): Promise<T> {
    return this.clientAdapter.createSession<T>(data);
  }

  async findSubscriptions(stipeCustomerId: string) {
    return this.clientAdapter.findSubscriptions(stipeCustomerId);
  }

  async cancelSubscription(id: string): Promise<void> {
    return this.clientAdapter.cancelSubscription(id);
  }
}
