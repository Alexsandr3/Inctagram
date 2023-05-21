import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../main/validators/result-notification';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';
import { BanUserCommand } from '../application/use-cases/ban-user.use-case';
import { IUsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { FetchUsersArgs } from './input-dto/fetch-users.args';

// @UseGuards(SuperAdminAuthGuard)
@Resolver()
export class SuperAdminResolver {
  constructor(private readonly userQueryRepository: IUsersQueryRepository, private readonly commandBus: CommandBus) {}
  @Query(() => [UserModel])
  async users(@Args() usersArgs: FetchUsersArgs): Promise<UserModel[]> {
    return this.userQueryRepository.getUsersForSuperAdmin(usersArgs);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('userId') userId: number): Promise<boolean> {
    const notification = await this.commandBus.execute<DeleteUserCommand, ResultNotification<boolean>>(
      new DeleteUserCommand(userId),
    );
    return notification.getData();
  }

  @Mutation(() => Boolean)
  async banUser(@Args('userId') userId: number, @Args('banReason') banReason: string): Promise<boolean> {
    const notification = await this.commandBus.execute<BanUserCommand, ResultNotification<boolean>>(
      new BanUserCommand(userId, banReason),
    );
    return notification.getData();
  }

  @Query(() => [UserModel])
  async searchUsersByName(@Args('userName') userName: string): Promise<UserModel[]> {
    return this.userQueryRepository.searchUsersByNameForSuperAdmin(userName);
  }
}
