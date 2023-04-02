import { Session } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityRepository {
  constructor() {}

  async findSessionByDeviceId(deviceId: string): Promise<Session | null> {
    // const session = await this.sessionRepositoryT.findOne({ where: { deviceId: deviceId } });
    // return session ?? null;
    return null;
  }

  async saveSession(session: Session): Promise<void> {
    // await this.sessionRepositoryT.save(session);
  }

  async deleteSessionByDeviceId(deviceId: string) {
    // await this.sessionRepositoryT.delete({ deviceId: deviceId });
  }
}
