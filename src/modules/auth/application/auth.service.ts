import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { LoginInputDto } from '../api/input-dto/login.input.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class AuthService {
  constructor(protected usersRepository: UsersRepository) {}

  async checkCredentialsOfUser(dto: LoginInputDto): Promise<number | null> {
    const foundUser = await this.usersRepository.findUserByEmail(dto.email);
    if (!foundUser || !foundUser.isConfirmed || !(await this.passwordIsCorrect(dto.password, foundUser.passwordHash)))
      return null;
    return foundUser.id;
  }

  private async passwordIsCorrect(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash);
  }
}
