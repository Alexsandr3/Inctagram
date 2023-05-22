import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../main/validators/result-notification';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';
import { BanUserCommand } from '../application/use-cases/ban-user.use-case';
import { IUsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { PaginationUsersInputDto } from './input-dto/pagination-users.input.args';
import { Paginated } from '../../../main/shared/paginated';
import { UserForSuperAdminViewModel } from './models/user-for-super-admin-view.model';
import { UsersWithPaginationViewModel } from './models/users-with-pagination-view.model';
import { UseGuards } from '@nestjs/common';
import { BasicAuthForGraphqlGuard } from './guards/basic-auth-for-graphql.guard';

@UseGuards(BasicAuthForGraphqlGuard)
@Resolver()
export class SuperAdminResolver {
  constructor(private readonly userQueryRepository: IUsersQueryRepository, private readonly commandBus: CommandBus) {}
  @Query(() => UsersWithPaginationViewModel)
  async users(@Args() usersArgs: PaginationUsersInputDto): Promise<Paginated<UserForSuperAdminViewModel[]>> {
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
}
