import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly usersRepositoryT: Repository<User>) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const foundUser = await this.usersRepositoryT.findOne({ where: { email: ILike(email) } });
    return foundUser ?? null;
  }

  async findUserByNameOrEmail(userName: string, email: string): Promise<User | null> {
    const foundUser = await this.usersRepositoryT.findOne({
      where: [{ userName: ILike(userName) }, { email: ILike(email) }],
    });

    return foundUser ?? null;
  }

  async findUserByConfirmationCode(confirmationCode: string): Promise<User | null> {
    const foundUser = await this.usersRepositoryT.findOne({
      where: { emailConfirmation: { confirmationCode: confirmationCode } },
    });
    return foundUser ?? null;
  }

  async saveUser(user: User): Promise<void> {
    await this.usersRepositoryT.save(user);
  }

  async deleteUser(userId: number) {
    await this.usersRepositoryT.delete({ id: userId });
  }
}
