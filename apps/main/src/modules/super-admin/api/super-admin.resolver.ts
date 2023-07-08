import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/main/validators/result-notification';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';
import { UpdateUserStatusCommand } from '../application/use-cases/update-user-status-use.case';
import { IUsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { PaginationUsersInputDto } from './input-dto/pagination-users.input.args';
import { Paginated } from '../../../main/shared/paginated';
import { UserForSuperAdminViewModel } from './models/user-for-super-admin-view.model';
import { UsersWithPaginationViewModel } from './models/users-with-pagination-view.model';
import { UpdateUserStatusInputArgs } from './input-dto/update-user-status-input.args';
import { PostForSuperAdminViewModel } from './models/post-for-super-admin-view.model';
import { IPostsRepository } from '../../posts/infrastructure/posts.repository';
import DataLoader from 'dataloader';
import { PostLoader } from '../post-loader';
import { Loader } from 'nestjs-dataloader';
import { SubscriptionForSuperAdminViewModel } from './models/subscription-for-super-admin-view.model';
import { ImageForSuperAdminViewModel } from './models/image-for-super-admin-view.model';
import { UseGuards } from '@nestjs/common';
import { BasicAuthForGraphqlGuard } from './guards/basic-auth-for-graphql.guard';
import { PaginationUserInputDto } from './input-dto/pagination-user.input.args';
import { ImagesWithPaginationViewModel } from './models/images-with-pagination-view.model';
import { ISubscriptionsRepository } from '../../subscriptions/infrastructure/subscriptions.repository';
import { PaymentsWithPaginationViewModel } from './models/payments-with-pagination-view.model';

@UseGuards(BasicAuthForGraphqlGuard)
@Resolver(() => UserForSuperAdminViewModel)
export class SuperAdminResolver {
  constructor(
    private readonly userQueryRepository: IUsersQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly postsRepository: IPostsRepository,
    private readonly subscriptionRepository: ISubscriptionsRepository,
  ) {}

  /**
   * Get users
   * @param usersArgs
   */
  @Query(() => UsersWithPaginationViewModel)
  async users(@Args() usersArgs: PaginationUsersInputDto): Promise<Paginated<UserForSuperAdminViewModel[]>> {
    return this.userQueryRepository.getUsersForSuperAdmin(usersArgs);
  }

  /**
   * Get user
   * @param userArgs
   * @param context
   */
  @Query(() => UserForSuperAdminViewModel)
  async user(@Args() userArgs: PaginationUserInputDto, @Context() context: any): Promise<UserForSuperAdminViewModel> {
    context.inputData = {};
    context.inputData.userId = userArgs.userId;
    context.inputData.sortBy = userArgs.sortBy;
    context.inputData.skip = userArgs.skip;
    context.inputData.isSortDirection = userArgs.isSortDirection();
    context.inputData.getPageSize = userArgs.getPageSize();
    context.inputData.getPageNumber = userArgs.getPageNumber();

    return this.userQueryRepository.getUserForSuperAdmin(userArgs);
  }

  /**
   * Get images by user id with pagination
   * @param context
   */
  @ResolveField(() => ImagesWithPaginationViewModel)
  async images(@Context() context: any): Promise<Paginated<ImageForSuperAdminViewModel[]>> {
    return this.postsRepository.getImagesById(context.inputData.userId, context.inputData);
  }

  /**
   * Get payments by user id with pagination
   * @param context
   */
  @ResolveField(() => PaymentsWithPaginationViewModel)
  async payments(@Context() context: any): Promise<Paginated<SubscriptionForSuperAdminViewModel[]>> {
    return this.subscriptionRepository.getPaymentsById(context.inputData.userId, context.inputData);
  }

  /**
   * Delete user by id
   * @param userId
   */
  @Mutation(() => Boolean)
  async deleteUser(@Args('userId') userId: number): Promise<boolean> {
    const notification = await this.commandBus.execute<DeleteUserCommand, ResultNotification<boolean>>(
      new DeleteUserCommand(userId),
    );
    return notification.getData();
  }

  /**
   * Update user status (ban/unban)
   * @param inputArgs
   */
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

//  @ResolveField(() => ImagesWithPaginationViewModel)
//   async images(
//     // @Parent() user: UserForSuperAdminViewModel,
//     @Context() context: any,
//     // @Loader(ImageLoader) imageLoader: DataLoader<number, ImageForSuperAdminViewModel[]>,
//   ): Promise<Paginated<ImageForSuperAdminViewModel[]>> {
//     // const { userId } = user;
//     return this.postsRepository.getImagesById(context.userId, context);
//   }

//  @ResolveField(() => [SubscriptionForSuperAdminViewModel])
//   async payments(
//     @Parent() user: UserForSuperAdminViewModel,
//     @Loader(SubscriptionLoader) subscriptionLoader: DataLoader<number, SubscriptionForSuperAdminViewModel[]>,
//   ): Promise<SubscriptionForSuperAdminViewModel[]> {
//     const { userId } = user;
//     return subscriptionLoader.load(userId);
//   }
