import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../main/validators/result-notification';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';
import { UpdateUserStatusCommand } from '../application/use-cases/update-user-status-use.case';
import { IUsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { PaginationUsersInputDto } from './input-dto/pagination-users.input.args';
import { Paginated } from '../../../main/shared/paginated';
import { UserForSuperAdminViewModel } from './models/user-for-super-admin-view.model';
import { UsersWithPaginationViewModel } from './models/users-with-pagination-view.model';
import { UseGuards } from '@nestjs/common';
import { BasicAuthForGraphqlGuard } from './guards/basic-auth-for-graphql.guard';
import { UpdateUserStatusInputArgs } from './input-dto/update-user-status-input.args';

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
  async updateUserStatus(@Args() inputArgs: UpdateUserStatusInputArgs): Promise<boolean> {
    const notification = await this.commandBus.execute<UpdateUserStatusCommand, ResultNotification<boolean>>(
      new UpdateUserStatusCommand(inputArgs.userId, inputArgs.banReason, inputArgs.isBanned),
    );
    return notification.getData();
  }
}
