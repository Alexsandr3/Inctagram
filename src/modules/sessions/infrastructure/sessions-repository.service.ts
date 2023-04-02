import { Session } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionsRepository {
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
}
