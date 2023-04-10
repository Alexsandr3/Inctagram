import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { User } from '@prisma/client';

export abstract class IUsersQueryRepository {
  abstract findUserById(id: number): Promise<User>;
}

@Injectable()
export class PrismaUsersQueryRepository implements IUsersQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }
}
