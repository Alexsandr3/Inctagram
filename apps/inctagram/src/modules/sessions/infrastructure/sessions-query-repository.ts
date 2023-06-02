import { SessionEntity } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

/**
 * @description Interface for sessions query repository ['findSessionsByUserId']
 */
export abstract class ISessionsQueryRepository {
  abstract findSessionsByUserId(userId: number): Promise<SessionEntity[]>;
}

@Injectable()
export class PrismaSessionsQueryRepository implements ISessionsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findSessionsByUserId(userId: number): Promise<SessionEntity[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
      },
    });
    return sessions.map(session => plainToInstance(SessionEntity, session));
  }
}
