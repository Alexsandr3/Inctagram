import { PasswordRecovery } from '../domain/password-recovery.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export abstract class IPasswordRecoveryRepository {
  abstract findPassRecovery(recoveryCode: string): Promise<PasswordRecovery | null>;
  abstract savePassRecovery(passRecovery: PasswordRecovery): Promise<void>;
  abstract deletePassRecovery(recoveryCode: string): Promise<void>;
}

@Injectable()
export class PasswordRecoveryRepository implements IPasswordRecoveryRepository {
  constructor(
    @InjectRepository(PasswordRecovery) private readonly passwordRecoveryRepositoryT: Repository<PasswordRecovery>,
  ) {}

  async findPassRecovery(recoveryCode: string): Promise<PasswordRecovery | null> {
    return await this.passwordRecoveryRepositoryT.findOne({
      where: { recoveryCode: recoveryCode },
    });
  }

  async savePassRecovery(passRecovery: PasswordRecovery) {
    await this.passwordRecoveryRepositoryT.save(passRecovery);
  }

  async deletePassRecovery(recoveryCode: string) {
    await this.passwordRecoveryRepositoryT.delete({ recoveryCode: recoveryCode });
  }
}
