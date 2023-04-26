import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { LoginInputDto } from '../api/input-dto/login.input.dto';
import { IUsersRepository } from '../../users/infrastructure/users.repository';
import { OAuth2InputDto } from '../api/input-dto/o-auth2.input.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(protected usersRepository: IUsersRepository) {}

  async checkCredentialsOfUser(dto: LoginInputDto): Promise<number | null> {
    const foundUser = await this.usersRepository.findUserByEmail(dto.email);

    if (!foundUser || !foundUser.isConfirmed || !(await this.passwordIsCorrect(dto.password, foundUser.passwordHash)))
      return null;
    return foundUser.id;
  }

  async checkCredentialsOfUserOAth2(dto: OAuth2InputDto): Promise<number | null> {
    const foundUser = await this.usersRepository.findUserByEmail(dto.email);

    if (!foundUser) {
      this.logger.log(`User with email ${dto.email} not found`);
      return null;
    } else if (!foundUser.isConfirmed) {
      this.logger.log(`Email ${dto.email} is not confirmed`);
      return null;
    }
    return foundUser.id;
  }

  private async passwordIsCorrect(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash);
  }

  async getPasswordHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, passwordSalt);
  }
}
