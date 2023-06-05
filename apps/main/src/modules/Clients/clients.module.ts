import { Module } from '@nestjs/common';
import { ClientAdapter } from './client-adapter';
import { ClientsService } from './clients-service';

@Module({
  providers: [ClientAdapter, ClientsService],
  exports: [ClientsService],
})
export class ClientModule {}
