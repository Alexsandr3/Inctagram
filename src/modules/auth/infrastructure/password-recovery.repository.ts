import { PasswordRecoveryEntity } from '../domain/password-recovery.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

export abstract class IPasswordRecoveryRepository {
  abstract findPassRecovery(recoveryCode: string): Promise<PasswordRecoveryEntity | null>;
  abstract savePassRecovery(passRecovery: PasswordRecoveryEntity): Promise<void>;
  abstract deletePassRecovery(recoveryCode: string): Promise<void>;
}

@Injectable()
export class PrismaPasswordRecoveryRepository implements IPasswordRecoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPassRecovery(recoveryCode: string): Promise<PasswordRecoveryEntity | null> {
    const passRecovery = await this.prisma.passwordRecovery.findFirst({
      where: {
        recoveryCode: recoveryCode,
      },
    });
    return plainToInstance(PasswordRecoveryEntity, passRecovery);
  }

  async savePassRecovery(passRecovery: PasswordRecoveryEntity) {
    await this.prisma.passwordRecovery.create({
      data: {
        recoveryCode: passRecovery.recoveryCode,
        expirationDate: passRecovery.expirationDate,
        email: passRecovery.email,
      },
    });
  }

  async deletePassRecovery(recoveryCode: string) {
    await this.prisma.passwordRecovery.delete({
      where: {
        recoveryCode: recoveryCode,
      },
    });
  }
}
