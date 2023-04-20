import { SessionEntity } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

export abstract class ISessionsRepository {
  abstract findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null>;
  abstract saveSession(session: SessionEntity): Promise<void>;
  abstract deleteSessionByDeviceId(deviceId: number): Promise<void>;
  abstract newDeviceId(): Promise<SessionEntity>;
}

@Injectable()
export class PrismaSessionsRepository implements ISessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({ where: { deviceId } });
    return plainToInstance(SessionEntity, session);
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
    return plainToInstance(SessionEntity, session);
  }
}
