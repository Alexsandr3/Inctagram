import { Session } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export abstract class ISessionsRepository {
  abstract findSessionByDeviceId(deviceId: number): Promise<Session | null>;
  abstract saveSession(session: Session): Promise<void>;
  abstract deleteSessionByDeviceId(deviceId: number): Promise<void>;
  abstract newDeviceId(): Promise<Session>;
}

@Injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(@InjectRepository(Session) private readonly sessionsRepositoryT: Repository<Session>) {}

  async findSessionByDeviceId(deviceId: number): Promise<Session | null> {
    const session = await this.sessionsRepositoryT.findOne({ where: { deviceId: deviceId } });
    return session ?? null;
  }

  async saveSession(session: Session): Promise<void> {
    await this.sessionsRepositoryT.save(session);
  }

  async deleteSessionByDeviceId(deviceId: number) {
    await this.sessionsRepositoryT.delete({ deviceId: deviceId });
  }

  async newDeviceId(): Promise<Session> {
    return this.sessionsRepositoryT.create();
  }
}
