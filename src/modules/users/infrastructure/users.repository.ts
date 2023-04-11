import { UserEntity } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';

export abstract class IUsersRepository {
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract findUserByNameOrEmail(userName: string, email: string): Promise<UserEntity | null>;
  abstract findUserByConfirmationCode(confirmationCode: string): Promise<UserEntity | null>;
  abstract saveUser(user: UserEntity);
  abstract deleteUser(userId: number);
  abstract updateUser(user: UserEntity);

  abstract findById(userId: number): Promise<UserEntity | null>;
}

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive', // установка нечувствительности к регистру для сравнения
        },
      },
      select: {
        id: true,
        userName: true,
        email: true,
        passwordHash: true,
        createdAt: true,
        emailConfirmation: {
          select: {
            isConfirmed: true,
            confirmationCode: true,
            codeExpirationDate: true,
          },
        },
      },
    });
    if (foundUser) {
      return UserEntity.preparationUser(foundUser);
    }
    return null;
  }
  async findUserByNameOrEmail(userName: string, email: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { userName: { contains: userName, mode: 'insensitive' } },
          { email: { contains: email, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        userName: true,
        email: true,
        passwordHash: true,
        createdAt: true,
        emailConfirmation: {
          select: {
            isConfirmed: true,
            confirmationCode: true,
            codeExpirationDate: true,
          },
        },
      },
    });
    if (foundUser) {
      return UserEntity.preparationUser(foundUser);
    }
    return null;
  }
  async findUserByConfirmationCode(confirmationCode: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        emailConfirmation: { confirmationCode: confirmationCode },
      },
      select: {
        id: true,
        userName: true,
        email: true,
        passwordHash: true,
        createdAt: true,
        emailConfirmation: {
          select: {
            isConfirmed: true,
            confirmationCode: true,
            codeExpirationDate: true,
          },
        },
      },
    });
    if (foundUser) {
      return UserEntity.preparationUser(foundUser);
    }
    return null;
  }
  async saveUser(user: UserEntity): Promise<void> {
    await this.prisma.user.create({
      data: {
        userName: user.userName,
        email: user.email,
        passwordHash: user.passwordHash,
        emailConfirmation: {
          create: {
            isConfirmed: user.emailConfirmation.isConfirmed,
            confirmationCode: user.emailConfirmation.confirmationCode,
            codeExpirationDate: user.emailConfirmation.codeExpirationDate,
          },
        },
      },
    });
  }
  async updateUser(user: UserEntity): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        userName: user.userName,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        emailConfirmation: {
          update: {
            isConfirmed: user.emailConfirmation.isConfirmed,
            confirmationCode: user.emailConfirmation.confirmationCode,
            codeExpirationDate: user.emailConfirmation.codeExpirationDate,
          },
        },
      },
    });
  }
  async deleteUser(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
  async findById(userId: number): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        passwordHash: true,
        createdAt: true,
        emailConfirmation: {
          select: {
            isConfirmed: true,
            confirmationCode: true,
            codeExpirationDate: true,
          },
        },
      },
    });
    if (foundUser) {
      return UserEntity.preparationUser(foundUser);
    }
    return null;
  }
}

/*

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@InjectRepository(UserEntity) private readonly usersRepositoryT: Repository<UserEntity>) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const foundUser = await this.usersRepositoryT.findOne({ where: { email: ILike(email) } });
    return foundUser ?? null;
  }

  async findUserByNameOrEmail(userName: string, email: string): Promise<UserEntity | null> {
    const foundUser = await this.usersRepositoryT.findOne({
      where: [{ userName: ILike(userName) }, { email: ILike(email) }],
    });

    return foundUser ?? null;
  }

  async findUserByConfirmationCode(confirmationCode: string): Promise<UserEntity | null> {
    const foundUser = await this.usersRepositoryT.findOne({
      where: { emailConfirmation: { confirmationCode: confirmationCode } },
    });
    return foundUser ?? null;
  }

  async saveUser(user: UserEntity): Promise<void> {
    await this.usersRepositoryT.save(user);
  }

  async deleteUser(userId: number) {
    await this.usersRepositoryT.delete({ id: userId });
  }

  //for update user
  async updateUser(user: UserEntity) {
    await this.usersRepositoryT.update({ id: user.id }, user);
  }
}
*/
