import { PasswordRecoveryEntity } from '../domain/password-recovery.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';

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
      select: {
        id: true,
        recoveryCode: true,
        expirationDate: true,
        email: true,
      },
    });
    if (passRecovery) {
      return PasswordRecoveryEntity.preparation(passRecovery);
    }
    return null;
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

/*@Injectable()
export class PasswordRecoveryRepository implements IPasswordRecoveryRepository {
  constructor(
    @InjectRepository(PasswordRecoveryEntity)
    private readonly passwordRecoveryRepositoryT: Repository<PasswordRecoveryEntity>,
  ) {}

  async findPassRecovery(recoveryCode: string): Promise<PasswordRecoveryEntity | null> {
    return await this.passwordRecoveryRepositoryT.findOne({
      where: { recoveryCode: recoveryCode },
    });
  }

  async savePassRecovery(passRecovery: PasswordRecoveryEntity) {
    await this.passwordRecoveryRepositoryT.save(passRecovery);
  }

  async deletePassRecovery(recoveryCode: string) {
    await this.passwordRecoveryRepositoryT.delete({ recoveryCode: recoveryCode });
  }
}*/
