import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor() {}

  async findUserByEmail(email: string): Promise<User | null> {
    //const foundUser = await this.usersRepositoryT.findOne({ where: { email: ILike(email) } });

    //return foundUser ?? null;
    return;
  }

  async findUserByConfirmationCode(confirmationCode: string): Promise<User | null> {
    // const foundUser = await this.usersRepositoryT.findOne({
    //   where: { emailConfirmation: { confirmationCode: confirmationCode } },
    // });
    //
    // return foundUser ?? null;
    return;
  }

  async saveUser(user: User): Promise<void> {
    //await this.usersRepositoryT.save(user);
  }

  async deleteUser(userId: string) {
    //await this.usersRepositoryT.delete({ id: userId });
  }
}
