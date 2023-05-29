import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
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
import { PostForSuperAdminViewModel } from './models/post-for-super-admin-view.model';
import { IPostsRepository } from '../../posts/infrastructure/posts.repository';
import DataLoader from 'dataloader';
import { PostLoader } from '../post-loader';
import { Loader } from 'nestjs-dataloader';

@UseGuards(BasicAuthForGraphqlGuard)
@Resolver(() => UserForSuperAdminViewModel)
export class SuperAdminResolver {
  constructor(
    private readonly userQueryRepository: IUsersQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly postsRepository: IPostsRepository,
  ) {}
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

  @ResolveField(() => [PostForSuperAdminViewModel])
  async posts(
    @Parent() user: UserForSuperAdminViewModel,
    @Loader(PostLoader) postsLoader: DataLoader<number, PostForSuperAdminViewModel[]>,
  ): Promise<PostForSuperAdminViewModel[]> {
    const { userId } = user;
    return postsLoader.load(userId);
    // return this.postsRepository.getPostsById(userId);
  }

  @ResolveField(() => Number)
  async postsCount(@Parent() user: UserForSuperAdminViewModel): Promise<number> {
    const { userId } = user;
    return this.postsRepository.getPostsCountByUserId(userId);
  }

  @ResolveField(() => Number)
  async imagesCount(@Parent() user: UserForSuperAdminViewModel): Promise<number> {
    const { userId } = user;
    return this.postsRepository.getImagesCountByUserId(userId);
  }
}
