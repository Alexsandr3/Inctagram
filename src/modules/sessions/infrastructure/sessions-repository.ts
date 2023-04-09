import { SessionEntity } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';

export abstract class ISessionsRepository {
  abstract findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null>;
  abstract saveSession(session: SessionEntity): Promise<void>;
  abstract updateSession(session: SessionEntity): Promise<void>;
  abstract deleteSessionByDeviceId(deviceId: number): Promise<void>;
  abstract newDeviceId(): Promise<SessionEntity>;
}

@Injectable()
export class PrismaSessionsRepository implements ISessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({
      where: {
        deviceId,
      },
      select: {
        deviceId: true,
        userId: true,
        exp: true,
        ip: true,
        deviceName: true,
        iat: true,
      },
    });
    if (session) {
      return SessionEntity.preparation(session);
    }
    return null;
  }

  async saveSession(session: SessionEntity): Promise<void> {
    await this.prisma.session.update({
      where: { deviceId: session.deviceId },
      data: {
        userId: session.userId,
        exp: session.exp,
        ip: session.ip,
        deviceName: session.deviceName,
        iat: session.iat,
      },
    });
  }

  async deleteSessionByDeviceId(deviceId: number): Promise<void> {
    await this.prisma.session.delete({ where: { deviceId } });
  }

  async newDeviceId(): Promise<SessionEntity> {
    const session = await this.prisma.session.create({
      data: {},
    });
    return SessionEntity.preparation(session);
  }

  async updateSession(session: SessionEntity): Promise<void> {
    await this.prisma.session.update({
      where: { deviceId: session.deviceId },
      data: {
        userId: session.userId,
        exp: session.exp,
        ip: session.ip,
        deviceName: session.deviceName,
        iat: session.iat,
      },
    });
  }
}

/*
@Injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(@InjectRepository(SessionEntity) private readonly sessionsRepositoryT: Repository<SessionEntity>) {}

  async findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null> {
    const session = await this.sessionsRepositoryT.findOne({ where: { deviceId: deviceId } });
    return session ?? null;
  }

  async saveSession(session: SessionEntity): Promise<void> {
    await this.sessionsRepositoryT.save(session);
  }

  async deleteSessionByDeviceId(deviceId: number) {
    await this.sessionsRepositoryT.delete({ deviceId: deviceId });
  }

  async newDeviceId(): Promise<SessionEntity> {
    return this.sessionsRepositoryT.create();
  }
}*/
