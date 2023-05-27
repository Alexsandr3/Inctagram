import { SessionEntity } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserStatus } from '@prisma/client';

export abstract class ISessionsRepository {
  abstract findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null>;
  abstract saveSession(session: SessionEntity): Promise<void>;
  abstract deleteSessionByDeviceId(deviceId: number): Promise<void>;
  abstract newDeviceId(): Promise<SessionEntity>;

  abstract deleteAllSessionsExceptCurrent(deviceId: number, userId: number): Promise<void>;
}

@Injectable()
export class PrismaSessionsRepository implements ISessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        deviceId,
        user: {
          status: {
            notIn: [UserStatus.DELETED],
          },
        },
      },
    });
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

  async deleteAllSessionsExceptCurrent(deviceId: number, userId: number): Promise<void> {
    // remove all sessions except current where userId = userId and deviceId != deviceId
    await this.prisma.session.deleteMany({
      where: {
        AND: [{ userId: { equals: userId } }, { deviceId: { not: { equals: deviceId } } }],
      },
    });
  }
}
